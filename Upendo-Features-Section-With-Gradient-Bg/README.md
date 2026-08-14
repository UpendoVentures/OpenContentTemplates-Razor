# Upendo Features Section With Gradient Background

This OpenContent template renders a two-column feature section with an optional heading, optional intro copy, one or two image cards, and four or more feature rows. Use it when a page needs to explain key product, service, or platform benefits with a strong visual image treatment and a configurable themed background.

## Quick Start

1. Add an OpenContent module to the target DNN page.
2. Select the `Upendo-Features-Section-With-Gradient-Bg` template.
3. In Content Edit, configure the module/admin fields, heading, intro copy, image count, image fields, alt text, and feature items.
4. In Template Settings, choose the background color class, container class, and spacing utility classes.
5. Save and verify the section on desktop, tablet, and mobile.
6. Confirm the reveal animation is visible during scroll and that reduced-motion users still see all content immediately.

## File Overview

| File | Purpose |
| --- | --- |
| `template.cshtml` | Razor markup, content fallback logic, image URL extraction, feature rendering, stylesheet registration, admin border hiding, and scroll reveal initialization. |
| `template.css` | Scoped styles for the section layout, image cards, icon themes, background overrides, responsive behavior, and reveal animation states. |
| `schema.json` | Content Edit schema for module metadata, heading, intro text, images, alt text, and the `Features` array. |
| `options.json` | Content Edit UI configuration, helpers, placeholders, image picker settings, accordion behavior, and select option labels. |
| `data.json` | Default content data, including sample image URLs, alt text, and default feature items. |
| `template-schema.json` | Template Settings schema for background, container, margin, and padding classes. |
| `template-options.json` | Template Settings UI configuration and labels for the settings schema. |
| `template-data.json` | Default Template Settings values. |

## Content Edit Field Reference

### Module And Admin Fields

| Field | Type | Required | Default | Rendering behavior |
| --- | --- | --- | --- | --- |
| `ModuleTitle` | `string` | No | `Features Section With Gradient Background` | Used as the section `aria-label` when populated. It is described as an administrator-facing title and does not render as visible page text. |
| `ModuleAnchor` | `string` | No | `features-gradient` | Used as the section `id` when populated. Must match `^[a-zA-Z0-9\-]+$`, so only letters, numbers, and hyphens are allowed. |

If `ModuleAnchor` is empty, the template generates `upendo-features-gradient-{ModuleId}`.

### Heading And Intro Fields

| Field | Type | Required | Default | Rendering behavior |
| --- | --- | --- | --- | --- |
| `SectionHeading` | `string` | No | Empty | Renders as an `h2` with classes `upendo-features-gradient__heading text-notransform`. HTML is allowed and rendered with `Html.Raw`. |
| `IntroText` | `string` | No | Empty | Renders below the heading inside `upendo-features-gradient__intro-text`. HTML is allowed and rendered with `Html.Raw`. |

The intro wrapper renders only when `SectionHeading` or `IntroText` has content.

### Media And Image Fields

| Field | Type | Required | Default | Rendering behavior |
| --- | --- | --- | --- | --- |
| `ImageCount` | `string` select | Yes | `two` | Controls whether the section renders only the primary image or the two-image overlapping composition. Values are `one` and `two`. |
| `PrimaryImage` | `string` with image editor | Yes in schema | Unsplash sample URL | Renders as the larger overlapping image card with class `upendo-features-gradient__image-card--primary`. |
| `PrimaryImageAltText` | `string` | No | `Team member reviewing analytics on a laptop` | Used as the primary image `alt` attribute. |
| `SecondaryImage` | `string` with image editor | No | Unsplash sample URL | Used only when `ImageCount` is `two`. Renders as the smaller overlapping image card with class `upendo-features-gradient__image-card--secondary`. |
| `SecondaryImageAltText` | `string` | No | `Collaborative planning session with reports and charts` | Used only when `ImageCount` is `two`. Used as the secondary image `alt` attribute. |

The image picker uploads to `Content/OpenContent/FeaturesGradient/`. The template accepts either an OpenContent image object with a `Url` property or a plain string URL.

### Feature Items

`Features` is an accordion array with `minItems: 4` and no fixed maximum, so editors can add more than four feature rows while existing four-item content remains valid. When the array contains more than four items, Razor adds `upendo-features-gradient--compact-features` to tighten the feature list automatically.

| Field | Type | Required | Default examples | Rendering behavior |
| --- | --- | --- | --- | --- |
| `IconClass` | `string` | Yes | `fas fa-chart-line`, `fas fa-fingerprint`, `fas fa-file-export`, `fas fa-gears` | Renders inside an `<i>` element. If blank at render time, the template falls back to `fas fa-check`. |
| `IconTheme` | `string` select | Yes | `icon-theme-violet`, `icon-theme-green`, `icon-theme-orange`, `icon-theme-blue` | Adds a color theme class to `upendo-features-gradient__icon`. If blank at render time, the template falls back to `icon-theme-violet`. |
| `Title` | `string` | Yes | `Real-Time Analytics` | Renders as an `h3` with classes `upendo-features-gradient__feature-title text-notransform`. HTML is allowed and rendered with `Html.Raw`. |
| `Description` | `string` | Yes | `Track performance as it happens with clear dashboards and actionable signals.` | Renders inside `upendo-features-gradient__feature-description`. HTML is allowed and rendered with `Html.Raw`. |

Available icon theme values:

| Value | Visual intent |
| --- | --- |
| `icon-theme-violet` | Violet icon and pale violet circle. |
| `icon-theme-green` | Green icon and pale green circle. |
| `icon-theme-orange` | Orange icon and pale orange circle. |
| `icon-theme-blue` | Blue icon and pale blue circle. |
| `icon-theme-teal` | Teal icon and pale teal circle. |
| `icon-theme-rose` | Rose icon and pale rose circle. |
| `icon-theme-amber` | Amber icon and pale amber circle. |
| `icon-theme-indigo` | Indigo icon and pale indigo circle. |
| `icon-theme-slate` | Slate icon and pale slate circle. |

Feature articles render only when the feature has a non-empty `Title` or `Description`. The icon still renders for any rendered feature article, using fallback values when needed.

### Links And Buttons

This template does not currently define link or button fields in `schema.json`, and `template.cshtml` does not render CTA buttons.

### Conditional Visibility Rules

`options.json` uses OpenContent `dependencies` so `SecondaryImage` and `SecondaryImageAltText` show only when `ImageCount` is `two`.

## Template Settings Field Reference

### Background Settings

| Field | Type | Default | Rendering behavior |
| --- | --- | --- | --- |
| `BackgroundColorClass` | `string` select | Empty string | Appended to the root section class. Supports Bootstrap/theme classes and custom neutral background classes. |

Supported values include an empty default plus: `bg-primary`, `bg-primary-scoped`, `bg-secondary`, `bg-secondary-scoped`, `bg-tertiary`, `bg-quaternary`, `bg-h5`, `bg-h6`, `bg-success`, `bg-danger`, `bg-warning`, `bg-info`, `bg-light`, `bg-dark`, `bg-white`, `bg-body`, `bg-transparent`, `bg-primary-subtle`, `bg-secondary-subtle`, `bg-success-subtle`, `bg-danger-subtle`, `bg-warning-subtle`, `bg-info-subtle`, `bg-light-subtle`, `bg-dark-subtle`, `bg-off-white`, `bg-warm-white`, `bg-cream`, `bg-soft-beige`, `bg-sand`, `bg-light-sage`, `bg-sage`, `bg-pale-green`, `bg-mist`, `bg-soft-gray`, and `bg-forest-green`.

The CSS explicitly defines local background colors for `bg-off-white`, `bg-warm-white`, `bg-cream`, `bg-soft-beige`, `bg-sand`, `bg-light-sage`, `bg-sage`, `bg-pale-green`, `bg-mist`, `bg-soft-gray`, and `bg-forest-green`.

For darker backgrounds such as `bg-primary`, `bg-secondary`, `bg-dark`, and `bg-forest-green`, the template changes heading and body CSS variables to white/light text.

### Layout And Container Settings

| Field | Type | Default | Rendering behavior |
| --- | --- | --- | --- |
| `ContainerClass` | `string` | `container-xxl` | Applied to the inner wrapper. If empty, Razor falls back to `container-xxl`. Use Bootstrap container classes or a known theme container class. |

There are no Template Settings for column order, text alignment, media alignment, item count, or grid density. Those behaviors are fixed in `template.cshtml` and `template.css`.

### Image And Media Settings

There are no Template Settings for image ratio, crop position, border radius, shadow, or image count. Image count is a Content Edit field. Media behavior is controlled by `ImageCount`, the populated image fields, and the scoped CSS classes.

### Animation And Reveal Settings

There are no editor-configurable animation settings. Scroll reveal timing is hardcoded in `template.cshtml` and `template.css`.

| Behavior | Current value |
| --- | --- |
| Base transition | `opacity 520ms ease`, `transform 620ms cubic-bezier(0.22, 1, 0.36, 1)` |
| Intro text delay | `100ms` |
| Media wrapper delay | `190ms` |
| Primary image card delay | `240ms` |
| Secondary image card delay | `300ms` |
| Feature base delay | `460ms` |
| Feature stagger | `120ms` per item |
| Feature delay cap | `940ms` |
| Observer root margin | `0px 0px -12% 0px` |
| Observer threshold | `0.18` |

### Margin And Padding Utilities

| Field | Type | Default | Allowed values |
| --- | --- | --- | --- |
| `MarginTop` | `string` select | `mt-auto` | `mt-0`, `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-auto` |
| `MarginBottom` | `string` select | `mb-auto` | `mb-0`, `mb-1`, `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-auto` |
| `PaddingTop` | `string` select | `pt-5` | `pt-0`, `pt-1`, `pt-2`, `pt-3`, `pt-4`, `pt-5`, `pt-auto` |
| `PaddingBottom` | `string` select | `pb-5` | `pb-0`, `pb-1`, `pb-2`, `pb-3`, `pb-4`, `pb-5`, `pb-auto` |

The selected classes are appended directly to the root section class.

## Rendering Behavior

### Root Structure And CSS Scope

The root section always starts with the class `upendo-features-gradient`. Optional background, margin, and padding classes are appended to that root class.

Primary child classes:

| Class | Role |
| --- | --- |
| `upendo-features-gradient__intro` | Centers the heading and intro copy. |
| `upendo-features-gradient__heading` | Visible section heading. |
| `upendo-features-gradient__intro-text` | Intro copy area. |
| `upendo-features-gradient__layout` | Main two-column grid. |
| `upendo-features-gradient__media` | Image card composition wrapper. |
| `upendo-features-gradient__glow` | Decorative radial gradient glow behind images. |
| `upendo-features-gradient__image-card` | Shared image card style. |
| `upendo-features-gradient__image-card--primary` | Larger top/left image card. |
| `upendo-features-gradient__image-card--secondary` | Smaller bottom/right image card. |
| `upendo-features-gradient--compact-features` | Root modifier added automatically when `Features.Count > 4`; tightens feature spacing and text rhythm while preserving the default four-item appearance. |
| `upendo-features-gradient__features` | Feature list wrapper with `role="list"`. |
| `upendo-features-gradient__feature` | Individual feature article with `role="listitem"`. |
| `upendo-features-gradient__icon` | Circular icon container. |
| `upendo-features-gradient__feature-content` | Feature text wrapper. |
| `upendo-features-gradient__feature-title` | Feature title. |
| `upendo-features-gradient__feature-description` | Feature description. |

The CSS is scoped with the `upendo-features-gradient` prefix. Preserve this scope when extending styles so changes do not leak into other OpenContent templates.

### Gradient Background Behavior

The visible gradient treatment is the decorative image-area glow, not a root linear-gradient background. The glow is created by `upendo-features-gradient__glow` using layered `radial-gradient()` backgrounds behind the image cards.

The root section background comes from `BackgroundColorClass`. If no background class is selected, the template uses the page/theme default background.

### Image And Media Card Behavior

Images render only when their URL fields are not empty and active for the selected `ImageCount`. If at least one active image is present, the media wrapper renders with a decorative glow.

| Image | Position | Desktop size | Mobile size |
| --- | --- | --- | --- |
| Primary | Top/left, `z-index: 2` | `width: min(68%, 25rem)`, `height: 27rem` | `width: 72%`, `height: 19rem` |
| Secondary | Bottom/right, `z-index: 3` | `width: min(58%, 21rem)`, `height: 23rem` | `width: 62%`, `height: 16rem` |

When `ImageCount` is `one`, only the primary image is rendered and the media wrapper receives `upendo-features-gradient__media--one-image` for the centered single-card layout.

Image cards use `object-fit: cover`, rounded corners, a light fallback background, and a large shadow. Image elements use `loading="lazy"` and `decoding="async"`.

### Feature Item Rendering

The feature wrapper renders with `role="list"`. Each rendered item is an `article` with `role="listitem"`.

Each feature uses a two-column internal grid: icon on the left and title/description on the right. The item renders only when it has a title or description. Empty icon fields fall back to `fas fa-check`; empty icon theme fields fall back to `icon-theme-violet`.

When more than four feature items exist, the root compact modifier reduces feature gaps, icon size, title size, description size, and line-height. One-image mode receives the strongest compact spacing so longer lists better fit the height of the single image card.

### Scroll Reveal And Timing Behavior

The template defines a namespaced initializer at `window.UpendoFeaturesGradientReveal`. It selects unrevealed `.upendo-features-gradient` sections and marks each initialized section with `data-upendo-features-gradient-reveal="true"` to prevent duplicate initialization.

Reveal targets are:

| Target | Reveal timing |
| --- | --- |
| Heading | Immediate base delay. |
| Intro text | `100ms`. |
| Media wrapper | `190ms`. |
| Primary image card | `240ms`. |
| Secondary image card | `300ms`. |
| Feature items | Starts at `460ms`, staggers by `120ms`, capped at `940ms`. |

When `IntersectionObserver` is available, each item receives `is-revealed` when it intersects. When `IntersectionObserver` is not available, all reveal targets receive `is-revealed` immediately.

### Responsive Behavior

| Breakpoint | Behavior |
| --- | --- |
| Default desktop | Two-column grid: media column and feature list column. The grid uses `minmax(0, 1fr) minmax(22rem, 0.9fr)`. In one-image mode, the feature column aligns to the top of the media area. |
| `max-width: 991.98px` | Layout collapses to one column. Media centers with `max-width: 43rem` and `min-height: 31rem`. |
| `max-width: 575.98px` | Media min-height becomes `24rem`; image card sizes, border radius, feature gaps, and icon size are reduced. |

### Reduced Motion And No-JS Behavior

If the user has `prefers-reduced-motion: reduce`, the script adds `is-revealed` immediately and does not observe the items. CSS also removes transitions and transforms for reveal-ready items under the same media query.

If JavaScript does not run, the section content remains visible because the hidden reveal state is only applied after the script adds `upendo-features-gradient--reveal-ready`.

## Usage Recipes

### Feature Section With Images

Use this for the intended hero-like benefit section.

1. Set `SectionHeading` to a concise benefit-led heading.
2. Add a short `IntroText` paragraph.
3. Set `ImageCount` to `two`.
4. Select both `PrimaryImage` and `SecondaryImage`.
5. Add meaningful alt text for both images.
6. Add four or more feature rows with short titles and one-sentence descriptions.
7. Use varied `IconTheme` values to create visual rhythm.

### Feature List Without Optional Media

The Razor can render the section without media if all image URLs used by the selected `ImageCount` are empty because the media wrapper only appears when at least one active image exists. However, `schema.json` marks `PrimaryImage` as required, so the editor may prevent saving an empty primary image depending on OpenContent validation behavior.

Use this recipe only if the editing experience allows the image fields to be cleared or if the schema is intentionally updated in a future migration.

### Callout Or Benefit Feature Grid

Use this template for a benefit callout when the content is structured around four or more proof points.

1. Keep the intro short so the image composition remains the visual anchor.
2. Use specific feature titles such as outcomes, capabilities, or differentiators.
3. Keep descriptions similar in length to avoid uneven vertical rhythm.
4. Choose a neutral or soft background class when the section appears between dense content blocks.

### Tuned Reveal Animation

There are no editor settings for animation tuning. To tune reveal behavior, update `template.cshtml` and `template.css` together.

Safe tuning points:

| Need | Edit location |
| --- | --- |
| Slower or faster fade | Transition durations in `template.css`. |
| Earlier or later reveal | `rootMargin` and `threshold` in `template.cshtml`. |
| Faster feature cascade | `featureDelay` and `featureStagger` in `template.cshtml`. |
| Reduced movement | Reveal `transform` values in `template.css`. |

## Asset Guidance

| Asset | Recommended minimum | Shape guidance |
| --- | --- | --- |
| Primary image | `1200px` wide by `1400px` tall | Portrait or vertical crop works best because the primary card is tall. |
| Secondary image | `1000px` wide by `1200px` tall | Portrait or near-portrait crop works best because the secondary card is also tall. |

Use images with clear focal points near the center because cards use `object-fit: cover`. Avoid critical text inside images because cropping changes across breakpoints.

WebP is appropriate when supported by the site, but WebP must be allowed globally in DNN file extensions before editors can upload WebP assets through the file picker.

## Accessibility Notes

| Area | Guidance |
| --- | --- |
| Heading hierarchy | `SectionHeading` renders as an `h2`. Place the module where an `h2` is appropriate in the page outline. If a different heading level is needed, plan a template change rather than manually faking hierarchy with styles. |
| Section label | The section `aria-label` uses `ModuleTitle` first, then `SectionHeading`, then `Features section`. Keep `ModuleTitle` clear if the visible heading is empty. |
| Image alt text | Fill `PrimaryImageAltText` and, in two-image mode, `SecondaryImageAltText` with concise descriptions when images communicate meaning. Use empty alt text only for decorative images. |
| Feature semantics | Features are exposed as a list with list items. Keep titles descriptive so assistive technology users can scan the section quickly. |
| Icons | Icons are marked `aria-hidden="true"`; do not rely on the icon alone to communicate meaning. Repeat the meaning in the title or description. |
| Reduced motion | Reduced-motion users receive immediate content visibility without transitions. Preserve this behavior when editing the reveal code. |

## Troubleshooting

| Problem | Check |
| --- | --- |
| Images do not appear | Confirm `ImageCount` is set correctly and the active image fields contain valid URLs or image picker values. Confirm the files exist and are published in DNN. Confirm the file type is allowed globally if using WebP. |
| Only one image appears | Confirm `ImageCount` is `two` and both image fields are populated. The media wrapper supports one or both active images, but each card renders independently. |
| Features do not render | Confirm the `Features` array has items and each item has a `Title` or `Description`. The schema expects at least four items. |
| Icons show as blank squares | Confirm the Font Awesome class is valid and that the theme loads the matching Font Awesome version. If `IconClass` is blank, the template falls back to `fas fa-check`. |
| Reveal animation is too fast or too slow | Timing is not editable in Template Settings. Update `featureDelay`, `featureStagger`, transition durations, or observer settings in the template files. |
| Reveal animation is not visible | Confirm JavaScript is enabled and that the section enters the viewport. Users with reduced motion enabled will not see the animation by design. Browsers without `IntersectionObserver` reveal everything immediately. |
| Section content is hidden | Check for JavaScript errors from other page scripts. The no-JS default should keep content visible because hidden states only apply after `upendo-features-gradient--reveal-ready` is added. |
| Stale styling after CSS edits | Clear DNN/client cache, recycle the application if needed, and hard-refresh the browser. Also confirm `template.css` is being registered by `template.cshtml`. |
| Fields are missing in the editor | This template has no conditional visibility rules. If fields are missing, confirm the correct template is selected and that `schema.json` and `options.json` are valid JSON. |

## Manual QA Checklist

- [ ] The OpenContent module saves without validation errors.
- [ ] The root section has `upendo-features-gradient` plus the selected background and spacing classes.
- [ ] The section `id` uses `ModuleAnchor` when provided and falls back to `upendo-features-gradient-{ModuleId}` when empty.
- [ ] The visible heading renders only when `SectionHeading` is populated.
- [ ] Intro copy renders only when `IntroText` is populated.
- [ ] One-image mode renders only the primary image card.
- [ ] Two-image mode renders primary and secondary images with correct `src`, `alt`, `loading="lazy"`, and `decoding="async"` attributes.
- [ ] Feature rows render in the same order as the Content Edit accordion, including when more than four items are configured.
- [ ] More than four feature rows add `upendo-features-gradient--compact-features`; four or fewer rows keep the default item sizing.
- [ ] Feature icons use the selected icon classes and icon theme colors.
- [ ] Empty icon class fallback renders `fas fa-check` if a feature still has text content.
- [ ] The desktop layout shows media and features in a two-column grid.
- [ ] Tablet layout collapses cleanly to one column at or below `991.98px`.
- [ ] Mobile layout keeps image cards cropped without horizontal scrolling.
- [ ] Scroll reveal animates heading, intro, media, image cards, and feature items once as they enter the viewport.
- [ ] Reduced-motion mode shows all reveal targets immediately without transition movement.
- [ ] Dark background choices keep heading and body copy readable.
- [ ] Browser console has no errors from `UpendoFeaturesGradientReveal`.
