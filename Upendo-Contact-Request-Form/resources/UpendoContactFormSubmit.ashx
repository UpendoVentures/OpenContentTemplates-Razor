<%@ WebHandler Language="C#" Class="UpendoContactFormSubmit" %>

using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Caching;

public class UpendoContactFormSubmit : IHttpHandler
{
    private const int StandardMaxLength = 300;
    private const int RequestMaxLength = 4000;
    private const int RateLimitMaxAttempts = 5;
    private static readonly TimeSpan RateLimitWindow = TimeSpan.FromMinutes(10);
    private static readonly object RateLimitLock = new object();

    public bool IsReusable
    {
        get { return false; }
    }

    public void ProcessRequest(HttpContext context)
    {
        try
        {
            ProcessRequestSafe(context);
        }
        catch (Exception ex)
        {
            LogWarning("Unhandled contact form error: " + ex);
            WriteResponse(context, 500, "Server Error", "The request could not be processed. Please try again later.");
        }
    }

    private static void ProcessRequestSafe(HttpContext context)
    {
        if (!context.Request.HttpMethod.Equals("POST", StringComparison.OrdinalIgnoreCase))
        {
            WriteResponse(context, 405, "Method Not Allowed", "This endpoint accepts POST submissions only.");
            return;
        }

        if (!IsAllowedOrigin(context))
        {
            LogWarning("Contact form rejected due to cross-origin or missing origin headers from IP " + GetClientIp(context) + ".");
            WriteResponse(context, 400, "Bad Request", "The request could not be processed. Please try again later.");
            return;
        }

        if (IsRateLimited(context))
        {
            LogWarning("Contact form rate limit exceeded from IP " + GetClientIp(context) + ".");
            WriteResponse(context, 429, "Too Many Requests", "Too many requests. Please try again later.");
            return;
        }

        var form = context.Request.Form;
        var firstName = ReadField(form, "FirstName", StandardMaxLength);
        var lastName = ReadField(form, "LastName", StandardMaxLength);
        var company = ReadField(form, "Company", StandardMaxLength);
        var phone = ReadField(form, "Phone", StandardMaxLength);
        var email = ReadField(form, "Email", StandardMaxLength);
        var request = ReadField(form, "Request", RequestMaxLength);
        var websiteUrl = ReadField(form, "WebsiteUrl", StandardMaxLength);
        var recaptchaResponse = ReadField(form, "g-recaptcha-response", RequestMaxLength);
        var recaptchaEnabled = IsTruthy(ReadField(form, "RecaptchaEnabled", StandardMaxLength));

        if (!string.IsNullOrWhiteSpace(websiteUrl))
        {
            LogWarning("Contact form honeypot triggered from IP " + GetClientIp(context) + ".");
            WriteResponse(context, 200, "Request Sent", "Thank you. Your request has been sent.");
            return;
        }

        if (string.IsNullOrWhiteSpace(firstName) && string.IsNullOrWhiteSpace(lastName))
        {
            WriteResponse(context, 400, "Validation Error", "Please provide at least a first name or last name.");
            return;
        }

        if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
        {
            WriteResponse(context, 400, "Validation Error", "Please provide a valid email address.");
            return;
        }

        if (string.IsNullOrWhiteSpace(request))
        {
            WriteResponse(context, 400, "Validation Error", "Please provide a request message.");
            return;
        }

        var recaptchaSecret = GetSetting("UPENDO_CONTACT_RECAPTCHA_SECRET", "UpendoContactForm.RecaptchaSecret");

        if (recaptchaEnabled)
        {
            if (string.IsNullOrWhiteSpace(recaptchaSecret))
            {
                LogWarning("reCAPTCHA is enabled but no secret is configured.");
                WriteResponse(context, 500, "Configuration Error", "The contact form is not configured correctly.");
                return;
            }

            if (string.IsNullOrWhiteSpace(recaptchaResponse))
            {
                WriteResponse(context, 400, "reCAPTCHA Error", "Please complete the reCAPTCHA challenge.");
                return;
            }

            if (!VerifyRecaptcha(recaptchaSecret, recaptchaResponse, context.Request.UserHostAddress))
            {
                WriteResponse(context, 400, "reCAPTCHA Error", "reCAPTCHA validation failed. Please try again.");
                return;
            }
        }
        else if (!string.IsNullOrWhiteSpace(recaptchaResponse) && string.IsNullOrWhiteSpace(recaptchaSecret))
        {
            LogWarning("A reCAPTCHA token was posted but no secret is configured.");
            WriteResponse(context, 500, "Configuration Error", "The contact form is not configured correctly.");
            return;
        }

        var toEmail = GetSetting("UPENDO_CONTACT_TO_EMAIL", "UpendoContactForm.ToEmail");
        if (string.IsNullOrWhiteSpace(toEmail) || !IsValidEmail(toEmail))
        {
            LogWarning("Contact form recipient email is missing or invalid.");
            WriteResponse(context, 500, "Configuration Error", "The contact form is not configured correctly.");
            return;
        }

        var fromEmail = GetSetting("UPENDO_CONTACT_FROM_EMAIL", "UpendoContactForm.FromEmail");
        if (string.IsNullOrWhiteSpace(fromEmail))
        {
            fromEmail = toEmail;
        }

        if (!IsValidEmail(fromEmail))
        {
            LogWarning("Contact form sender email is invalid.");
            WriteResponse(context, 500, "Configuration Error", "The contact form is not configured correctly.");
            return;
        }

        var subject = GetSetting("UPENDO_CONTACT_SUBJECT", "UpendoContactForm.Subject");
        if (string.IsNullOrWhiteSpace(subject))
        {
            subject = "Website contact request";
        }

        var body = BuildEmailBody(firstName, lastName, company, phone, email, request);
        var mailResult = SendEmail(fromEmail, toEmail, subject, body);

        if (!string.IsNullOrWhiteSpace(mailResult))
        {
            LogWarning("Contact form email failed: " + mailResult);
            WriteResponse(context, 500, "Mail Error", "The request could not be sent. Please try again later.");
            return;
        }

        WriteResponse(context, 200, "Request Sent", "Thank you. Your request has been sent.");
    }

    private static string ReadField(NameValueCollection form, string name, int maxLength)
    {
        var value = form[name] ?? string.Empty;
        value = value.Trim();
        return value.Length <= maxLength ? value : value.Substring(0, maxLength);
    }

    private static bool IsTruthy(string value)
    {
        return value.Equals("true", StringComparison.OrdinalIgnoreCase) || value == "1" || value.Equals("yes", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsValidEmail(string email)
    {
        return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase);
    }

    private static string GetSetting(string environmentVariableName, string appSettingName)
    {
        var value = Environment.GetEnvironmentVariable(environmentVariableName);
        return SanitizeHeaderValue(!string.IsNullOrWhiteSpace(value) ? value : ConfigurationManager.AppSettings[appSettingName]);
    }

    private static string SanitizeHeaderValue(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        return value.Replace("\r", string.Empty).Replace("\n", string.Empty).Trim();
    }

    private static bool IsAllowedOrigin(HttpContext context)
    {
        var origin = context.Request.Headers["Origin"];
        if (!string.IsNullOrWhiteSpace(origin))
        {
            return IsSameRequestHost(context, origin);
        }

        var referer = context.Request.Headers["Referer"];
        if (!string.IsNullOrWhiteSpace(referer))
        {
            return IsSameRequestHost(context, referer);
        }

        return IsLocalRequest(context);
    }

    private static bool IsSameRequestHost(HttpContext context, string value)
    {
        Uri postedUri;
        if (!Uri.TryCreate(value, UriKind.Absolute, out postedUri))
        {
            return false;
        }

        return context.Request.Url != null && string.Equals(postedUri.Host, context.Request.Url.Host, StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsRateLimited(HttpContext context)
    {
        var key = "UpendoContactFormSubmit:" + GetClientIp(context);

        lock (RateLimitLock)
        {
            var cachedAttempts = HttpRuntime.Cache[key];
            var attempts = cachedAttempts is int ? (int)cachedAttempts : 0;
            var nextAttempts = attempts + 1;

            HttpRuntime.Cache.Insert(key, nextAttempts, null, DateTime.UtcNow.Add(RateLimitWindow), Cache.NoSlidingExpiration);
            return nextAttempts > RateLimitMaxAttempts;
        }
    }

    private static string GetClientIp(HttpContext context)
    {
        var value = context.Request.UserHostAddress;
        return string.IsNullOrWhiteSpace(value) ? "unknown" : Regex.Replace(value, @"[^a-zA-Z0-9:\.\-_]", "_");
    }

    private static bool IsLocalRequest(HttpContext context)
    {
        try
        {
            return context.Request.IsLocal;
        }
        catch
        {
            return false;
        }
    }

    private static bool VerifyRecaptcha(string secret, string response, string remoteIp)
    {
        try
        {
            using (var client = new WebClient())
            {
                var values = new NameValueCollection
                {
                    { "secret", secret },
                    { "response", response }
                };

                if (!string.IsNullOrWhiteSpace(remoteIp))
                {
                    values.Add("remoteip", remoteIp);
                }

                var resultBytes = client.UploadValues("https://www.google.com/recaptcha/api/siteverify", "POST", values);
                var result = Encoding.UTF8.GetString(resultBytes);
                return Regex.IsMatch(result, "\\\"success\\\"\\s*:\\s*true", RegexOptions.IgnoreCase);
            }
        }
        catch (Exception ex)
        {
            LogWarning("reCAPTCHA verification failed: " + ex.Message);
            return false;
        }
    }

    private static string BuildEmailBody(string firstName, string lastName, string company, string phone, string email, string request)
    {
        var body = new StringBuilder();
        body.Append("<h2>Website contact request</h2>");
        AppendRow(body, "First Name", firstName);
        AppendRow(body, "Last Name", lastName);
        AppendRow(body, "Company", company);
        AppendRow(body, "Phone", phone);
        AppendRow(body, "Email", email);
        AppendMultilineRow(body, "Request", request);
        return body.ToString();
    }

    private static string SendEmail(string fromEmail, string toEmail, string subject, string body)
    {
        try
        {
            var mailType = Type.GetType("DotNetNuke.Services.Mail.Mail, DotNetNuke", false);
            if (mailType == null)
            {
                return "DotNetNuke mail API could not be loaded.";
            }

            var sendEmail = mailType.GetMethod("SendEmail", BindingFlags.Public | BindingFlags.Static, null, new[] { typeof(string), typeof(string), typeof(string), typeof(string) }, null);
            if (sendEmail != null)
            {
                var result = sendEmail.Invoke(null, new object[] { fromEmail, toEmail, subject, body });
                return result == null ? string.Empty : Convert.ToString(result);
            }

            var sendMailMethods = mailType.GetMethods(BindingFlags.Public | BindingFlags.Static);
            foreach (var method in sendMailMethods)
            {
                if (!string.Equals(method.Name, "SendMail", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var parameters = method.GetParameters();
                if (parameters.Length == 7)
                {
                    var result = method.Invoke(null, new object[] { fromEmail, toEmail, string.Empty, subject, body, string.Empty, "HTML" });
                    return result == null ? string.Empty : Convert.ToString(result);
                }
            }

            return "No compatible DotNetNuke mail method was found.";
        }
        catch (TargetInvocationException ex)
        {
            return ex.InnerException != null ? ex.InnerException.Message : ex.Message;
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }

    private static void AppendRow(StringBuilder body, string label, string value)
    {
        body.Append("<p><strong>");
        body.Append(HttpUtility.HtmlEncode(label));
        body.Append(":</strong> ");
        body.Append(HttpUtility.HtmlEncode(value));
        body.Append("</p>");
    }

    private static void AppendMultilineRow(StringBuilder body, string label, string value)
    {
        body.Append("<p><strong>");
        body.Append(HttpUtility.HtmlEncode(label));
        body.Append(":</strong> ");
        body.Append(HttpUtility.HtmlEncode(value).Replace("\r\n", "\n").Replace("\n", "<br />"));
        body.Append("</p>");
    }

    private static void WriteResponse(HttpContext context, int statusCode, string title, string message)
    {
        context.Response.StatusCode = statusCode;

        if (WantsJson(context))
        {
            context.Response.ContentType = "application/json; charset=utf-8";
            context.Response.Write("{\"success\":" + (statusCode >= 200 && statusCode < 300 ? "true" : "false") + ",\"message\":\"" + HttpUtility.JavaScriptStringEncode(message) + "\"}");
            return;
        }

        context.Response.ContentType = "text/html; charset=utf-8";
        context.Response.Write("<!doctype html><html><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>");
        context.Response.Write(HttpUtility.HtmlEncode(title));
        context.Response.Write("</title></head><body><main style=\"font-family:Arial,sans-serif;max-width:720px;margin:48px auto;padding:0 20px;line-height:1.5\"><h1>");
        context.Response.Write(HttpUtility.HtmlEncode(title));
        context.Response.Write("</h1><p>");
        context.Response.Write(HttpUtility.HtmlEncode(message));
        context.Response.Write("</p><p><a href=\"javascript:history.back()\">Back to form</a></p></main></body></html>");
    }

    private static bool WantsJson(HttpContext context)
    {
        var accept = context.Request.Headers["Accept"];
        return !string.IsNullOrWhiteSpace(accept) && accept.IndexOf("application/json", StringComparison.OrdinalIgnoreCase) >= 0;
    }

    private static void LogWarning(string message)
    {
        try
        {
            var exceptionsType = Type.GetType("DotNetNuke.Services.Exceptions.Exceptions, DotNetNuke", false);
            var logException = exceptionsType != null ? exceptionsType.GetMethod("LogException", BindingFlags.Public | BindingFlags.Static, null, new[] { typeof(Exception) }, null) : null;
            if (logException != null)
            {
                logException.Invoke(null, new object[] { new Exception(message) });
            }
        }
        catch
        {
        }
    }
}
