# OpenContent Template Development Guide

This repository contains runtime Razor/OpenContent templates for DNN sites. Templates execute inside the deployed DNN/OpenContent application and may consume the deployed `RunsOnUpendoCore` assembly or OpenContentHelper APIs. This guide records the rules for safe, compatible, and reviewable template updates.

## Quick path

1. Inspect the target template and every companion file: `schema.json`, `options.json`, `view.json`, `data.json`, `manifest.json`, CSS, and JavaScript.
2. Verify the template's `RunsOnUpendoCore` or OpenContentHelper contract before changing markup or data behavior.
3. Use legacy Razor syntax supported by the deployed OpenContent runtime.
4. Recheck security, accessibility, responsive behavior, theme inheritance, and image attributes.
5. Validate the rendered result in the local DNN site before delivery.

## Runtime model

| Area | Rule |
| --- | --- |
| Template runtime | Templates inherit from `Satrabel.OpenContent.Components.OpenContentWebPage` or an established repository equivalent. |
| Input model | `schema.json` defines the data model; `options.json` defines the editor UI. |
| DNN context | Use the existing `Dnn` portal, tab, module, user, request, and edit-mode context patterns. |
| Shared logic | Prefer deployed `RunsOnUpendoCore` helpers, services, models, controllers, and formatters. |
| API integration | Use established OpenContentHelper/Services Framework routes, module context, credentials, and anti-forgery behavior. |
| Deployment | Template folders are runtime assets copied into the DNN portal OpenContent Templates directory. |
| Frameworks | Assume Bootstrap and the active theme dependencies are already loaded. Do not add duplicate bundles. |

## Mandatory implementation rules

### Compatibility

- Use legacy Razor syntax only.
- Match the casing and naming conventions of neighboring templates.
- Do not introduce modern Razor features unless the deployed runtime is proven to support them.
- Do not add a README for an individual template.

### Security

- Preserve server-side authorization and portal/module/user scoping.
- Do not trust submitted IDs, query-string values, or dynamic content without the established validation path.
- Reuse centralized Core security, URL, sanitization, and authorization helpers where available.
- Preserve DNN Services Framework request context and anti-forgery headers for protected API calls.
- Do not expose internal implementation details, secrets, stack traces, or protected data.

### Accessibility

- Use semantic headings, landmarks, lists, buttons, links, and form labels.
- Provide keyboard operation and visible focus for interactive controls.
- Use `aria-*` attributes only when they accurately describe the current state or relationship.
- Provide useful alternative text for meaningful images and empty alternative text for decorative images.
- Do not communicate state through color alone.
- Keep status, validation, loading, empty, and error messages understandable to assistive technology.

### Markup and styling

- Every `<img>` must include `loading="lazy"` and `decoding="async"`.
- Inherit typography, colors, spacing, and other text presentation from the active theme unless the requirement explicitly says otherwise.
- Use Porto's built-in animation attributes when animation is requested; do not create a parallel animation system.
- Do not add HTML encoding or decoding methods in Razor unless explicitly required by the specification.
- Do not duplicate logic that already exists in `RunsOnUpendoCore`.
- A local helper is appropriate only when the behavior is genuinely unique to the current template.

## Change surface checklist

- [ ] `Template.cshtml` or `template.cshtml` uses legacy-compatible Razor syntax.
- [ ] `schema.json` matches the values the template reads.
- [ ] `options.json` provides an appropriate OpenContent editing experience.
- [ ] `view.json`, `data.json`, or `manifest.json` is updated only when required.
- [ ] Existing CSS/JavaScript registration and template paths are preserved.
- [ ] Module, tab, and portal IDs are used consistently and safely.
- [ ] Core helpers/services were checked before adding local logic.
- [ ] All images have lazy loading and asynchronous decoding attributes.
- [ ] Security and accessibility behavior was reviewed.
- [ ] No README, generated package, deployment artifact, or unrelated file was added.

## Authoritative references

- [OpenContent Getting Started](https://opencontent.readme.io/docs/getting-started)
- [OpenContent Field Types](https://opencontent.readme.io/docs/field-types)
- [Porto Animations](https://porto.mandeeps.com/shortcodes/shortcodes-4/animations)
- `C:/Work/RunsOnUpendo/RunsOnUpendoHelper/RunsOnUpendoHelper/Libraries/RunsOnUpendoCore/Helpers/TemplateHelper.cs`

This guide is a local development aid. The deployed DNN/OpenContent runtime, current template patterns, and the relevant `RunsOnUpendoCore` contracts remain the final compatibility authorities.
