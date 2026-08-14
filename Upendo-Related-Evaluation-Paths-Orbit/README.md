# Upendo Related Evaluation Paths Orbit

This OpenContent template renders a Portexa related-evaluation-paths section with an optional eyebrow, centered heading, one to four content cards, and a decorative animated orbit graphic. Use it when a page needs to show adjacent solution paths or evaluation categories while keeping a strong visual connection to the Portexa brand or another central concept.

## Quick Start

1. Add an OpenContent module to the target DNN page.
2. Select the `Upendo-Related-Evaluation-Paths-Orbit` template.
3. In Content Edit, configure the module metadata:
   - Set `Module Title` for administrator-facing identification.
   - Set `Module Anchor` if the section needs a stable page anchor.
4. Configure the section copy:
   - Add optional `Section Eyebrow`.
   - Set `Section Heading`.
   - Add optional `Intro Text`.
5. Configure the orbit center:
   - Choose `Central Logo Type` as `Icon` or `Image`.
   - For icon mode, set `Central Icon Class`.
   - For image mode, upload/select `Central Logo Image` and set `Central Logo Alt Text`.
6. Configure one to four cards:
   - Set each card `Eyebrow`, `Title`, and optional `Description`.
   - Add `Link` only when the whole card should be clickable.
   - Enable `Open In New Window` only for links that should open in a new tab.
7. Configure decorative `Orbit Items`:
   - Set `Label`, `Icon Class`, `Icon Color`, and `Orbit Number`.
   - Leave `Angle` empty for automatic placement, or enter a degree value for custom placement.
8. In Template Settings, configure background, container width, animation speed, orbit visibility, opacity, margin, and padding.
9. Save and verify desktop, tablet, mobile, reduced-motion behavior, card links, and the central logo.

## File Overview

| File | Purpose |
| --- | --- |
| `template.cshtml` | Razor renderer for module metadata, heading, intro, card output, orbit rings, central icon/image, links, and defensive dynamic value handling. |
| `template.css` | Scoped styles for the card grid, orbit visual, animation speeds, icon color classes, responsive behavior, and reduced-motion behavior. |
| `schema.json` | Content Edit data schema for module fields, section copy, central logo fields, cards, and orbit items. |
| `options.json` | Content Edit field UI configuration, helpers, placeholders, upload folder, option labels, accordions, and conditional dependencies. |
| `data.json` | Default content data used when a new module instance is created. |
| `template-schema.json` | Template Settings schema for background, container, animation, orbit visibility, opacity, margin, and padding options. |
| `template-options.json` | Template Settings UI configuration and labels. |
| `template-data.json` | Default Template Settings values. |
| `README.md` | Maintainer and editor documentation for this template. |

## Content Edit Field Reference

### Module and Admin Fields

| Field | Type | Required | Default | Behavior |
| --- | --- | --- | --- | --- |
| `ModuleTitle` | Text | No | `Related Evaluation Paths Orbit` | Administrator-facing title. It is used as the section `aria-label` fallback before the visible heading. It does not render as visible visitor text. |
| `ModuleAnchor` | Text | No | `related-evaluation-paths` | Optional section `id`. Must match `^[a-zA-Z0-9\-]+$`, so use letters, numbers, and hyphens only. If empty, the template generates `upendo-related-evaluation-orbit-{ModuleId}`. |

### Section Heading and Intro Fields

| Field | Type | Required | Default | Behavior |
| --- | --- | --- | --- | --- |
| `SectionEyebrow` | Text | No | Empty | Optional uppercase label rendered above the section heading with class `upendo-related-evaluation-orbit__section-eyebrow`. HTML is allowed and rendered with `Html.Raw`. |
| `SectionHeading` | Text | Yes | `Related evaluation paths` | Renders as an `h2` with class `upendo-related-evaluation-orbit__heading text-notransform`. HTML is allowed and rendered with `Html.Raw`. |
| `IntroText` | Textarea | No | Empty | Optional supporting copy below the heading. HTML is allowed and rendered with `Html.Raw`. |

The header renders only when `SectionEyebrow`, `SectionHeading`, or `IntroText` has content.

### Central Logo Fields

| Field | Type | Required | Default | Visibility | Behavior |
| --- | --- | --- | --- | --- | --- |
| `CentralLogoType` | Select | No | `image` | Always visible | Accepts `icon` or `image`. The editor labels are `Icon` and `Image`. If the saved value is not `image`, Razor treats it as `icon`. |
| `CentralIconClass` | Text | No | `fas fa-route` | Visible only when `CentralLogoType` is `icon` | Font Awesome class used for the central icon. If empty, Razor falls back to `fas fa-route`. |
| `CentralLogoImage` | Image | No | `/Portals/0/Branding/portexa-logo-bug-150x150.png` | Visible only when `CentralLogoType` is `image` | Image rendered in the orbit center when image mode is selected and an image URL exists. Upload/typeahead folder is `Content/OpenContent/RelatedEvaluationPathsOrbit/`. |
| `CentralLogoAltText` | Text | No | `Portexa logo` | Visible only when `CentralLogoType` is `image` | Alt text for the central image. If empty, Razor falls back to `ModuleTitle`, then `SectionHeading`, then `Related evaluation paths`. |

If `CentralLogoType` is `image` but no image URL is available, the center falls back to icon rendering with `CentralIconClass` or `fas fa-route`.

### Cards Array

`Cards` is an accordion field with `titleField` set to `Title`. The schema allows up to four cards with `maxItems: 4` and no minimum item count. Each card requires `Title`.

| Field | Type | Required | Behavior |
| --- | --- | --- | --- |
| `Eyebrow` | Text | No | Small uppercase category label above the card title. HTML is allowed by the renderer. |
| `Title` | Text | Yes | Main card title. HTML is allowed by the renderer. |
| `Description` | Textarea | No | Supporting card copy. HTML is allowed by the renderer. |
| `Link` | Text | No | When populated, the full card renders as an anchor. When empty, the card renders as an `article`. |
| `OpenInNewWindow` | Checkbox | No | When true and `Link` is populated, the anchor uses `target="_blank"` and `rel="noopener noreferrer"`. |

Cards with no `Eyebrow`, `Title`, or `Description` are skipped by the renderer. The renderer also stops after four renderable cards, which protects against imported or malformed data that bypasses the editor schema.

### Orbit Items Array

`OrbitItems` is an accordion field with `titleField` set to `Label`. Orbit items are decorative chips rendered on one of three dotted orbit rings.

| Field | Type | Required | Default/Fallback | Behavior |
| --- | --- | --- | --- | --- |
| `Label` | Text | Yes | None | Internal label and hover `title` attribute for the chip. The orbit wrapper is hidden from assistive technology, so this is not announced as page content. |
| `IconClass` | Text | No | `fas fa-circle` | Font Awesome class for the chip icon. |
| `IconColor` | Select | No | `orbit-color-slate` | Applies a scoped color class to the chip. |
| `OrbitNumber` | Select | Yes | `1` if invalid | Places the item on orbit ring `1`, `2`, or `3`. Invalid or out-of-range values fall back to `1`. |
| `Angle` | Text | No | Automatic placement | Optional custom angle in degrees. Enter a number such as `45`. Leave empty to auto-position by display order within that orbit. |

Available `IconColor` values:

| Value | Label | CSS Color |
| --- | --- | --- |
| `orbit-color-blue` | Blue | `#2563eb` |
| `orbit-color-cyan` | Cyan | `#0891b2` |
| `orbit-color-green` | Green | `#16a34a` |
| `orbit-color-orange` | Orange | `#ea580c` |
| `orbit-color-purple` | Purple | `#7c3aed` |
| `orbit-color-rose` | Rose | `#e11d48` |
| `orbit-color-slate` | Slate | `#475569` |
| `orbit-color-dark` | Dark | `#111827` |

### Conditional Visibility Rules

| Selection | Visible Fields | Hidden Fields |
| --- | --- | --- |
| `CentralLogoType = icon` | `CentralIconClass` | `CentralLogoImage`, `CentralLogoAltText` |
| `CentralLogoType = image` | `CentralLogoImage`, `CentralLogoAltText` | `CentralIconClass` |

The conditional rules are declared in both `schema.json` and `options.json`. Keep those dependencies aligned when changing these fields.

## Template Settings Field Reference

| Field | Type | Default | Values | Rendering Behavior |
| --- | --- | --- | --- | --- |
| `BackgroundColorClass` | Select | Empty | Bootstrap/theme background classes, including `bg-primary`, `bg-light`, `bg-dark`, `bg-soft-gray`, `bg-forest-green`, and others | Appended to the root section class. `bg-soft-gray` has a local CSS override to `#ebeef3`. |
| `ContainerClass` | Text | `container-xxl` | Any container class string | Applied to the inner wrapper before `upendo-related-evaluation-orbit__container`. Empty values fall back to `container-xxl`. |
| `AnimationSpeed` | Select | `orbit-speed-normal` | `orbit-speed-slow`, `orbit-speed-normal`, `orbit-speed-fast` | Appended to the root section class and changes orbit animation durations. Empty values fall back to `orbit-speed-normal`. |
| `OrbitVisibility` | Select | `orbit-visible` | `orbit-visible`, `orbit-hidden` | Appended to the root section class. `orbit-hidden` hides the decorative orbit visual. Empty values fall back to `orbit-visible`. |
| `OrbitOpacity` | Select | `1` | `1`, `0.85`, `0.7`, `0.55`, `0.4`, `0.25`, `0.1` | Sets CSS custom property `--related-orbit-opacity`. Invalid values fall back to `1`. |
| `MarginTop` | Select | `mt-auto` | `mt-0` through `mt-5`, `mt-auto` | Appended to the root section class when populated. |
| `MarginBottom` | Select | `mb-auto` | `mb-0` through `mb-5`, `mb-auto` | Appended to the root section class when populated. |
| `PaddingTop` | Select | `pt-5` | `pt-0` through `pt-5`, `pt-auto` | Appended to the root section class when populated. |
| `PaddingBottom` | Select | `pb-5` | `pb-0` through `pb-5`, `pb-auto` | Appended to the root section class when populated. |

## Rendering Behavior

### Root and Class Scope

The root section uses the base class `upendo-related-evaluation-orbit`. All custom child classes use the `upendo-related-evaluation-orbit__` prefix.

The root class list is built from:

| Source | Example |
| --- | --- |
| Base class | `upendo-related-evaluation-orbit` |
| Animation speed | `orbit-speed-normal` |
| Orbit visibility | `orbit-visible` |
| Background class | `bg-soft-gray` |
| Margin classes | `mt-auto`, `mb-auto` |
| Padding classes | `pt-5`, `pb-5` |

The root section also receives:

| Attribute | Behavior |
| --- | --- |
| `id` | Uses `ModuleAnchor` or generated `upendo-related-evaluation-orbit-{ModuleId}`. |
| `aria-label` | Uses `ModuleTitle`, then `SectionHeading`, then `Related evaluation paths`. |
| `style` | Sets `--related-orbit-opacity:{OrbitOpacity};`. |

The template calls `TemplateHelper.HideAdminBorder(Model.Context.ModuleId, Model.Context.TabId)` and registers `template.css` with `RegisterStyleSheet("template.css")`.

### Card Rendering and Link Wrapping

Cards render inside `.upendo-related-evaluation-orbit__cards`.

| Link State | Element | Attributes |
| --- | --- | --- |
| `Link` populated and `OpenInNewWindow = false` | `<a>` | `href="{Link}"` |
| `Link` populated and `OpenInNewWindow = true` | `<a>` | `href="{Link}" target="_blank" rel="noopener noreferrer"` |
| `Link` empty | `<article>` | No link attributes |

The card content always uses `.upendo-related-evaluation-orbit__card-inner` with optional eyebrow, title, and description spans.

### Center Logo and Icon Rendering

The orbit center renders inside `.upendo-related-evaluation-orbit__center`.

| Mode | Output |
| --- | --- |
| Icon mode | `<i class="{CentralIconClass}" aria-hidden="true"></i>` |
| Image mode with valid image URL | `<img class="upendo-related-evaluation-orbit__center-image" src="..." alt="..." loading="lazy" decoding="async" />` |
| Image mode without image URL | Falls back to icon mode. |

### Orbit and Chip Rendering

Orbit items render only when `OrbitItems` contains items. The visual is a decorative, pointer-events-disabled stage positioned to the right and partially cropped outside the card grid.

| Element | Class |
| --- | --- |
| Visual wrapper | `upendo-related-evaluation-orbit__visual` |
| Stage | `upendo-related-evaluation-orbit__orbit-stage` |
| Orbit ring 1 | `upendo-related-evaluation-orbit__orbit upendo-related-evaluation-orbit__orbit--1` |
| Orbit ring 2 | `upendo-related-evaluation-orbit__orbit upendo-related-evaluation-orbit__orbit--2` |
| Orbit ring 3 | `upendo-related-evaluation-orbit__orbit upendo-related-evaluation-orbit__orbit--3` |
| Chip | `upendo-related-evaluation-orbit__item` plus position and color classes |

When `Angle` is empty, items receive auto-position classes from `upendo-related-evaluation-orbit__item--pos-0` through `upendo-related-evaluation-orbit__item--pos-7`. The position index resets for each orbit ring and wraps after eight positions.

When `Angle` is populated, the item receives `upendo-related-evaluation-orbit__item--custom` and inline CSS `--orbit-angle:{Angle}deg;`.

### Decorative and Accessibility Behavior

The orbit rings use `aria-hidden="true"`. The visual wrapper uses `aria-hidden="false"` only when the center renders an image; otherwise it uses `aria-hidden="true"`. Chip labels are assigned to the `title` attribute for hover context, but the orbit itself should be treated as decorative content.

### Responsive Behavior

| Breakpoint | Behavior |
| --- | --- |
| Default desktop | One to four cards render in matching centered columns. Orbit visual is absolutely positioned on the right and partially cropped. |
| `max-width: 1199.98px` | Cards become a two-column grid where applicable with `max-width: 45rem`; single-card layouts stay centered; orbit shifts right to `-25rem`. |
| `max-width: 767.98px` | Cards become a single-column grid with `max-width: 28rem`; card minimum height is removed; orbit visual is hidden. |

### Reduced Motion Behavior

When the visitor has `prefers-reduced-motion: reduce`, orbit animation is disabled and card transitions are removed.

## Usage Recipes

### Central Icon Orbit

Use this when the center should represent an abstract concept rather than a brand image.

1. Set `Central Logo Type` to `Icon`.
2. Set `Central Icon Class` to an available Font Awesome class, such as `fas fa-route`.
3. Keep orbit items enabled for the animated decorative context.
4. Verify the icon font is loaded by the site theme.

### Central Image or Logo Orbit

Use this for Portexa branding or another recognizable logo mark.

1. Set `Central Logo Type` to `Image`.
2. Upload or select `Central Logo Image`.
3. Set concise `Central Logo Alt Text`, such as `Portexa logo`.
4. Prefer a square or near-square transparent PNG/SVG-style asset if the site supports it.
5. Verify the image remains readable inside the 5.6rem center tile.

### Linked Cards

Use this when each card should navigate to a related solution page.

1. Add a relative or absolute URL to each card `Link` field.
2. Keep `Open In New Window` disabled for normal internal navigation.
3. Enable `Open In New Window` only for external resources or intentional new-tab behavior.
4. Verify the full card hover/focus state works and the card label clearly describes the destination.

### Custom Orbit Item Placement

Use this when automatic placement causes visual overlap or when a specific icon should appear at a specific point.

1. Choose the item's `Orbit Number`.
2. Enter an `Angle` value from `0` to `359`.
3. Preview the page at desktop width.
4. Adjust nearby items on the same orbit if chips overlap.
5. Leave `Angle` empty for any item that should use automatic placement.

## Asset Guidance

### Central Logo Image

- Use a compact logo mark rather than a wide horizontal logo.
- Prefer transparent-background images when possible.
- Keep the source image sharp at small sizes; the rendered image is constrained to 72% of a 5.6rem center tile.
- The configured upload/typeahead folder is `Content/OpenContent/RelatedEvaluationPathsOrbit/`.
- The default data uses `/Portals/0/Branding/portexa-logo-bug-150x150.png`.

### Icon Classes

- Use Font Awesome classes already available in the DNN theme, for example `fas fa-route` or `fas fa-satellite-dish`.
- If an orbit item `IconClass` is empty, the template uses `fas fa-circle`.
- If the central icon class is empty, the template uses `fas fa-route`.
- If an icon does not appear, confirm the icon family and style are loaded by the page theme.

### Color and Token Guidance

- Use the built-in orbit color classes for orbit chips instead of custom inline colors.
- Use `Background Color` settings for section backgrounds so the root class remains theme-compatible.
- `bg-soft-gray` is locally defined in `template.css`; other background classes depend on Bootstrap or the active theme.
- Use `Orbit Opacity` to soften the decorative visual instead of editing CSS for one-off pages.

## Accessibility Notes

| Area | Guidance |
| --- | --- |
| Heading hierarchy | The visible heading renders as `h2`. Confirm the surrounding page structure makes `h2` appropriate. |
| Section label | The section receives an `aria-label` from `ModuleTitle`, then `SectionHeading`, then `Related evaluation paths`. Keep `ModuleTitle` meaningful. |
| Central image alt text | In image mode, provide concise alt text. If the image is purely decorative, consider whether icon mode or an empty/fallback strategy is more appropriate before changing the template. |
| Decorative orbit items | Orbit rings are `aria-hidden`. Do not place essential information only in orbit chips. The cards must carry the meaningful content. |
| Card links | The full card becomes the link. Make card titles and descriptions clear enough to identify the destination. |
| New-window links | New-tab links use `rel="noopener noreferrer"`. Only enable them when the behavior is intentional. |
| Motion | `prefers-reduced-motion: reduce` disables orbit animation and card transitions. |

## Troubleshooting

| Problem | Likely Cause | Fix |
| --- | --- | --- |
| Central icon fields are not visible | `Central Logo Type` is set to `Image`. | Change `Central Logo Type` to `Icon`. |
| Central image fields are not visible | `Central Logo Type` is set to `Icon`. | Change `Central Logo Type` to `Image`. |
| Central image does not show | Image mode is selected, but the image value is empty, invalid, not uploaded, inaccessible, or blocked by site file restrictions. | Re-select/upload the image, verify the file path, and confirm the extension is allowed by DNN/site settings. |
| Center falls back to an icon | `Central Logo Type` is `image`, but Razor cannot resolve an image URL. | Confirm `CentralLogoImage` has a valid URL value. |
| Icons do not show | The Font Awesome class is wrong or the matching font/style is not loaded by the theme. | Use an icon class already used elsewhere on the site and confirm the required Font Awesome family is available. |
| Orbit item appears on the wrong ring | `OrbitNumber` is empty, invalid, or outside `1` to `3`. | Select Inner, Middle, or Outer Orbit in the editor. Invalid values fall back to ring `1`. |
| Orbit items overlap | Too many items share the same orbit or custom angles are too close together. | Move items to another orbit, clear `Angle` for auto-placement, or use more distinct degree values. |
| Custom angle does not behave as expected | `Angle` includes unsupported text or a value outside the expected `0` to `359` range. | Use a plain number such as `45`, `180`, or `315`. |
| Orbit is not visible | `Orbit Visibility` is set to `Hidden`, there are no orbit items, or the viewport is mobile. | Set visibility to `Visible`, add orbit items, and test above `767.98px`. |
| Orbit is too strong or too faint | `Orbit Opacity` setting is too high or too low. | Adjust `Orbit Opacity` in Template Settings. |
| CSS edits do not appear | DNN/browser caching is serving stale CSS. | Clear DNN cache, recycle if needed, and hard-refresh the browser. |

## Manual QA Checklist

- [ ] New OpenContent module can select `Upendo-Related-Evaluation-Paths-Orbit`.
- [ ] Optional `Section Eyebrow` renders above the heading when populated and creates no visible output when empty.
- [ ] `Section Heading` renders as an `h2` and appears above the cards.
- [ ] Optional `Intro Text` renders below the heading and does not create extra spacing when empty.
- [ ] Content Edit allows one, two, three, or four cards and does not allow more than four cards.
- [ ] One-card, two-card, three-card, and four-card layouts render without blank placeholder cards.
- [ ] Cards without links render as non-clickable cards.
- [ ] Cards with links render as full-card anchors.
- [ ] Cards with `Open In New Window` render with `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] Icon center mode shows the configured Font Awesome icon.
- [ ] Image center mode shows the configured image with correct alt text.
- [ ] Image center mode falls back safely if no image URL is available.
- [ ] Orbit items render on the selected rings.
- [ ] Orbit items auto-position when `Angle` is empty.
- [ ] Orbit items use custom placement when `Angle` is populated.
- [ ] Each configured `Icon Color` option displays correctly.
- [ ] `Animation Speed` changes the orbit speed on desktop.
- [ ] `Orbit Visibility = Hidden` hides the decorative visual.
- [ ] `Orbit Opacity` changes visual opacity without affecting cards.
- [ ] Background, margin, padding, and container settings apply as expected.
- [ ] Desktop layout shows four cards in one row when enough width is available.
- [ ] Tablet layout shows two columns.
- [ ] Mobile layout shows one column and hides the orbit visual.
- [ ] Reduced-motion browser settings disable orbit animation and card transitions.
- [ ] The section anchor works when `ModuleAnchor` is set.
- [ ] No unrelated OpenContent templates changed during maintenance.
