# Upendo Contact Request Form

Reusable OpenContent visual template for a contact request form. It renders semantic form markup, optional Google reCAPTCHA v2 checkbox markup, and posts to a minimal ASP.NET handler by default.

## Submission Behavior

By default, `FormAction` posts to `/Portals/_default/Handlers/UpendoContactFormSubmit.ashx`.

Deploy `UpendoContactFormSubmit.ashx` to `Website/Portals/_default/Handlers/`. The handler accepts POST only, validates the required basics server-side, checks the request origin, rate-limits submissions by IP, optionally verifies Google reCAPTCHA, and sends the request through DNN native email.

When `FormAction` is blank or invalid, the template falls back to the default handler. The form uses `post` by default.

Allowed `FormAction` values are relative URLs, anchors, `http`, and `https` URLs.

If reCAPTCHA is enabled and `RecaptchaSiteKey` is configured, the template renders `RecaptchaEnabled=true` as a hidden field so the handler requires server-side validation. The secret key must never be stored in this template.

The JavaScript submission sends `Accept: application/json`. The handler returns JSON in this shape for AJAX requests: `{ "success": true|false, "message": "..." }`. Direct browser/testing requests without a JSON `Accept` header keep the simple HTML response fallback.

## Server Configuration

Configure these values as environment variables when possible. The handler falls back to `appSettings` keys when environment variables are not present.

- `UPENDO_CONTACT_TO_EMAIL` or `UpendoContactForm.ToEmail`: Required recipient address. Missing value returns a configuration error.
- `UPENDO_CONTACT_FROM_EMAIL` or `UpendoContactForm.FromEmail`: Optional sender address. Falls back to the recipient address.
- `UPENDO_CONTACT_SUBJECT` or `UpendoContactForm.Subject`: Optional subject. Falls back to `Website contact request`.
- `UPENDO_CONTACT_RECAPTCHA_SECRET` or `UpendoContactForm.RecaptchaSecret`: Required only when the template renders reCAPTCHA. Missing value returns a configuration error if reCAPTCHA is enabled or a token is posted.

The template stores only the public reCAPTCHA site key in `RecaptchaSiteKey`.

Do not store secrets in `web.config` unless that is the deployment team's accepted secret-management approach.

The `resources/.appSettings` file contains safe placeholder examples for the matching `web.config` `<appSettings>` entries. Replace every placeholder value per environment before deployment.

The handler trims and strips CR/LF from `ToEmail`, `FromEmail`, and `Subject` before sending. `ToEmail` and `FromEmail` must pass the same email validation used for submitter addresses, otherwise the handler returns a generic configuration error and logs the detail through DNN reflection logging.

## Security Hardening

- Origin protection: POST requests must include an `Origin` host matching the current request host. If `Origin` is missing, the handler checks `Referer`. If both are missing, the request is rejected with `400` unless it is local.
- Cross-host posts are not allowed.
- Rate limiting: each client IP is limited to 5 attempts per 10 minutes using ASP.NET in-memory cache. Excess attempts return `429` before reCAPTCHA or mail processing.
- Honeypot: the template renders a visually hidden `WebsiteUrl` field with `autocomplete="off"` and `tabindex="-1"`. If it is filled, the handler returns the normal success message with `200` and does not send email, to avoid giving bots useful feedback.
- Error hygiene: user-facing messages are generic. Internal exception details and mail/reCAPTCHA diagnostics are logged when DNN logging is available, but stack traces and raw exception messages are not returned to the browser.
- reCAPTCHA remains optional and uses the existing v2 checkbox siteverify flow when enabled.

## Content Edit Fields

Content Edit is limited to visible page content and editable form copy.

- `ModuleTitle`: Administrator-facing title only.
- `ModuleAnchor`: Optional safe page anchor. Letters, numbers, and hyphens only.
- `SectionAriaLabel`: Accessible label used when the visible heading is empty.
- `HeadingLead`, `HeadingEmphasis`: Split heading fields. The lead renders regular and the emphasis renders bold.
- `NameLabel`, `FirstNameLabel`, `LastNameLabel`: Editable labels for the name group and subfields.
- `CompanyLabel`, `PhoneLabel`, `EmailLabel`, `RequestLabel`: Editable field labels.
- `RequestPlaceholder`: Optional textarea placeholder.
- `SubmitText`: Editable submit button text.

## Template Settings

Template Settings contain layout, design, and behavior configuration.

- `ContainerWidth`
- `MarginTop`
- `MarginBottom`
- `PaddingTop`
- `PaddingBottom`
- `BackgroundColorClass`
- `AccentColor`: Hex color for the left accent border on inputs. Accepts `#RGB` or `#RRGGBB`; defaults to `#ff4057`.
- `FormAction`: Optional submission target. Defaults to `/Portals/_default/Handlers/UpendoContactFormSubmit.ashx`. Blank or invalid values fall back to the default handler.
- `FormMethod`: `post` or `get`; defaults to `post`.
- `NameRequired`, `EmailRequired`, `RequestRequired`: Control required attributes and visible red asterisks.
- `EnableRecaptcha`: Renders an optional Google reCAPTCHA v2 checkbox before the submit button.
- `RecaptchaSiteKey`: Public Google reCAPTCHA site key. This value is safe to render in the browser; never store the secret key here.
- `RecaptchaTheme`: `light` or `dark`; defaults to `light`.
- `RecaptchaSize`: `normal` or `compact`; defaults to `normal`.

The template reads behavior settings from `Model.Settings` first and falls back to older Content Edit values for existing modules that saved those fields before they moved.

## Accessibility And Safety

- The section uses `aria-labelledby` when the visible heading is present, otherwise `SectionAriaLabel`.
- Field IDs include the module ID to avoid duplicate IDs when the template appears more than once on a page.
- First and last name inputs are grouped with `role="group"` and a shared visible label.
- Required fields render both a red asterisk and the matching HTML `required` attribute.
- Editable text is Razor-encoded by default.
- Form action values are sanitized to allow relative URLs, anchors, `http`, and `https` only.
- Accent color values are validated as safe hex colors before being written to the inline CSS custom property.
- reCAPTCHA renders only when `EnableRecaptcha` is enabled and `RecaptchaSiteKey` is not blank. The site key, theme, and size attributes are HTML attribute encoded.
- The handler HTML-encodes response output and email body content, truncates standard fields to 300 characters, truncates the request message to 4000 characters, rejects non-POST requests, and returns JSON for AJAX submissions.

## Resources

The `resources/` folder contains deployment helpers for the server-side handler.

- `resources/UpendoContactFormSubmit.ashx`: Deployable copy of the DNN contact form handler.
- `resources/install-handler.bat`: Copies the handler to `Website/Portals/_default/Handlers/UpendoContactFormSubmit.ashx`.
- `resources/.appSettings`: Example `web.config` `<appSettings>` entries. Values are placeholders only; replace secrets and email addresses per environment.

Run the installer from the `resources/` folder or any working directory:

```bat
install-handler.bat
```

The script resolves paths relative to its own location, creates `Website/Portals/_default/Handlers/` if needed, and overwrites the target handler with the deployable copy.

If the batch file cannot be run on the server, manually copy:

```text
Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/resources/UpendoContactFormSubmit.ashx
```

to:

```text
Website/Portals/_default/Handlers/UpendoContactFormSubmit.ashx
```

Deploy these template files together:

- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/template.cshtml`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/template.css`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/template-data.json`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/template-options.json`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/template-schema.json`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/data.json`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/options.json`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/schema.json`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/README.md`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/resources/UpendoContactFormSubmit.ashx`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/resources/install-handler.bat`
- `Website/Portals/_default/OpenContent/Templates/Upendo-Contact-Request-Form/resources/.appSettings`

The live handler file is deployed to:

```text
Website/Portals/_default/Handlers/UpendoContactFormSubmit.ashx
```

## Deployment Checklist

- Run `resources/install-handler.bat`, or manually copy `resources/UpendoContactFormSubmit.ashx` to `Website/Portals/_default/Handlers/UpendoContactFormSubmit.ashx`.
- Configure `UPENDO_CONTACT_TO_EMAIL` or `UpendoContactForm.ToEmail`.
- Configure `UPENDO_CONTACT_FROM_EMAIL` or `UpendoContactForm.FromEmail` if the sender should differ from the recipient.
- Configure `UPENDO_CONTACT_SUBJECT` or `UpendoContactForm.Subject` if the default subject is not acceptable.
- If reCAPTCHA is enabled in the template, configure `UPENDO_CONTACT_RECAPTCHA_SECRET` or `UpendoContactForm.RecaptchaSecret` with the matching Google reCAPTCHA v2 checkbox secret key.
- Confirm the public form is submitted from the same host that serves the handler, because cross-host POSTs are rejected.
