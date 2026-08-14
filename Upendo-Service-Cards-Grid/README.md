# Upendo Service Cards Grid

Reusable OpenContent template for displaying a responsive grid of service, capability, or solution cards. Each card can use the original icon treatment or a full-width top image, while preserving the same title, description, and optional linked-card behavior.

## Quick Start

1. Add an OpenContent module to the page.
2. Select the `Upendo-Service-Cards-Grid` template.
3. In Content Edit, configure the module title, optional anchor, section heading, intro text, and cards.
4. For each card, choose `Visual Type` as either `Icon` or `Image`.
5. Configure Template Settings for background, container width, card styling, spacing, and scroll reveal animations.
6. Verify the grid on desktop, tablet, and mobile.
7. If images use WebP, confirm WebP is allowed globally in DNN file extensions.

## File Overview

| File | Purpose |
|---|---|
| `template.cshtml` | Razor rendering logic for the section, heading, intro, card grid, icon/image modes, links, and reveal script. |
| `template.css` | Scoped styles for `.oc-service-cards-*`, responsive grid behavior, card visuals, image mode, hover states, and animation states. |
| `schema.json` | Content Edit data schema for module fields and the `Cards` array. |
| `options.json` | Content Edit editor configuration, helpers, field widgets, upload folders, labels, and conditional visibility. |
| `data.json` | Default content data used when the template is first added. |
| `template-schema.json` | Template Settings schema for background, layout, card styling, icon color, animation, and spacing controls. |
| `template-options.json` | Template Settings editor configuration and labels. |
| `template-data.json` | Default Template Settings values. |
| `README.md` | Maintainer and editor documentation for this template. |

## Content Edit Field Reference

### Module And Admin Fields

| Field | Type | Required | Default | Rendering behavior |
|---|---:|---:|---|---|
| `ModuleTitle` | string | No | `Service Cards Grid` | Admin-facing title. Used as the section `aria-label` when present. It is not visually rendered. |
| `ModuleAnchor` | string | No | empty | Creates an empty `<div id="..."></div>` before the section for anchor links. Must match `^[a-zA-Z0-9\-]+$`. |

### Section Heading And Intro Fields

| Field | Type | Required | Default | Rendering behavior |
|---|---:|---:|---|---|
| `SectionHeading` | string | No | `Explore solution paths by operational need.` | Renders as an `<h2>` with `.oc-service-cards-heading`. HTML is allowed and rendered raw. |
| `IntroText` | string | No | Default intro copy in `data.json` | Renders below the heading inside `.oc-service-cards-intro`. HTML is allowed and rendered raw. |

The header wrapper renders only when either `SectionHeading` or `IntroText` has content.

### Cards Array

`Cards` is a required array with `minItems: 1`. In the editor, it uses an accordion and `Title` is the accordion label. Cards render in the same order they appear in Content Edit.

| Field | Type | Required | Default | Rendering behavior |
|---|---:|---:|---|---|
| `VisualType` | string enum | No | `icon` | Selects the card visual mode. Allowed values are `icon` and `image`; editor labels are `Icon` and `Image`. |
| `IconClass` | string | No | `fas fa-check` | FontAwesome class used in icon mode when `IconImage` is empty. |
| `IconImage` | image | No | empty | Small image used in icon mode. Takes priority over `IconClass`. Upload/typeahead folder: `Content/OpenContent/ServiceCards/`. |
| `CardImage` | image | No | empty | Full-width top image used in image mode. Upload/typeahead folder: `Content/OpenContent/ServiceCards/`. |
| `CardImagePosition` | string enum | No | `center center` | CSS `object-position` value for image-mode card crops. Allowed values are the nine top/center/bottom and left/center/right combinations. |
| `Title` | string | Yes | default card title | Renders as `<h3 class="oc-service-cards-card-title">`. HTML is allowed and rendered raw. |
| `Description` | string | Yes | default card description | Renders inside `.oc-service-cards-card-description`. HTML is allowed and rendered raw. |
| `Link` | object/url editor | No | object with empty `Url` | If `Link.Url` has a value, the whole card renders as an `<a>`. Otherwise it renders as an `<article>`. |

### Visual Type Rules

| Selection | Visible fields | Output |
|---|---|---|
| `Icon` | `IconClass`, `IconImage` | Shows `IconImage` if set; otherwise shows the FontAwesome icon from `IconClass`. |
| `Image` | `CardImage`, `CardImagePosition` | Shows a full-width top image when `CardImage` is set and applies the selected focal position to the image crop. |

Missing `VisualType` values are backward compatible. The Razor logic only treats a card as image mode when `VisualType` equals `image`, so old cards without `VisualType` continue to render as icon cards.

Missing `CardImagePosition` values are also backward compatible. The Razor logic defaults them to `center center` and validates every value against an allow-list before rendering inline CSS.

### Conditional Visibility Rules

The editor dependencies are defined in `options.json`:

| Field | Visible when |
|---|---|
| `IconClass` | `VisualType` is `icon` |
| `IconImage` | `VisualType` is `icon` |
| `CardImage` | `VisualType` is `image` |
| `CardImagePosition` | `VisualType` is `image` |

## Template Settings Field Reference

### Section And Layout Settings

| Field | Default | Purpose |
|---|---|---|
| `BackgroundColorClass` | empty | Adds a Bootstrap or theme background class to `.oc-service-cards-section`. Includes standard Bootstrap values and custom theme values such as `bg-off-white`, `bg-warm-white`, `bg-cream`, `bg-soft-beige`, `bg-sand`, `bg-light-sage`, `bg-sage`, `bg-pale-green`, `bg-mist`, `bg-soft-gray`, and `bg-forest-green`. |
| `ContainerClass` | `container-xxl` | Sets the inner wrapper class. Use Bootstrap container classes or a theme-specific container class. Blank values fall back to `container-xxl`. |
| `CardsPerRow` | `3` | Controls the desktop card count per row. Allowed values are `1`, `2`, `3`, and `4`. Invalid or missing values fall back to `3`. |

The CSS grid uses the selected desktop `CardsPerRow` count, caps tablet layouts at two columns below `991.98px`, and uses one column below `575.98px`.

### Card Styling Settings

| Field | Default | Purpose |
|---|---|---|
| `CardBackgroundColor` | `#f5f6f8` | Inline `background-color` for each card. |
| `CardMinHeight` | `17rem` | Inline `min-height` for cards on tablet and desktop. Mobile forces `min-height: auto`. |
| `CardBorderRadius` | `1.5rem` | Inline `border-radius` for each card. Image mode inherits this radius for top corners. |
| `CardShadow` | `0 1rem 2.5rem rgba(15, 23, 42, 0.08)` | Inline `box-shadow` for each card. |
| `IconColorClass` | `text-primary` | Class applied to FontAwesome icon wrappers when an icon class is used. Not applied to `IconImage`. |

### Animation Settings

| Field | Default | Allowed values | Purpose |
|---|---|---|---|
| `HeadingAnimation` | `fade-up` | `none`, `fade-up`, `fade-in`, `slide-left`, `slide-right`, `zoom-in` | Scroll reveal animation for the heading. |
| `IntroAnimation` | `fade-in` | `none`, `fade-up`, `fade-in`, `slide-left`, `slide-right`, `zoom-in` | Scroll reveal animation for the intro. |
| `CardsAnimation` | `fade-up` | `none`, `fade-up`, `fade-in`, `slide-left`, `slide-right`, `zoom-in` | Scroll reveal animation for cards. Cards receive staggered delays of `140ms` per card. |

Invalid animation values are normalized to the template fallback in `template.cshtml`.

### Spacing Utility Settings

| Field | Default | Allowed values |
|---|---|---|
| `MarginTop` | `mt-auto` | `mt-0`, `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-auto` |
| `MarginBottom` | `mb-auto` | `mb-0`, `mb-1`, `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-auto` |
| `PaddingTop` | `pt-5` | `pt-0`, `pt-1`, `pt-2`, `pt-3`, `pt-4`, `pt-5`, `pt-auto` |
| `PaddingBottom` | `pb-5` | `pb-0`, `pb-1`, `pb-2`, `pb-3`, `pb-4`, `pb-5`, `pb-auto` |

These values are appended directly to `.oc-service-cards-section`.

## Rendering Behavior

### Main Structure

The template renders only when there is a heading, intro, or at least one card.

| Element | Class/attribute | Notes |
|---|---|---|
| Section | `.oc-service-cards-section` | Receives background, margin, and padding classes. Uses `aria-label` from `ModuleTitle`, then `SectionHeading`, then `Service cards`. |
| Container | value of `ContainerClass` | Defaults to `container-xxl`. |
| Header | `.oc-service-cards-header` | Renders only when heading or intro exists. |
| Heading | `.oc-service-cards-heading` | Renders as `h2`. |
| Intro | `.oc-service-cards-intro` | Supports raw HTML content. |
| Grid | `.oc-service-cards-grid.oc-service-cards-grid-{CardsPerRow}` with `role="list"` | Responsive CSS grid. |
| Card | `.oc-service-cards-card` with `role="listitem"` | Renders as `<article>` when not linked. |
| Linked card | `.oc-service-cards-card.oc-service-cards-card-link` | Renders as `<a>` when `Link.Url` exists. |
| Image-mode card | `.oc-service-cards-card-image-mode` | Removes card padding and uses a top image area. |

### Icon Mode

Icon mode is the default mode.

- If `IconImage` is set, the template renders `<img class="oc-service-cards-icon-image">` inside `.oc-service-cards-icon-wrap`.
- If `IconImage` is empty and `IconClass` is set, the template renders `<i class="{IconClass} oc-service-cards-icon"></i>`.
- FontAwesome icon wrappers receive `IconColorClass`, defaulting to `text-primary`.
- FontAwesome icons are marked decorative with `aria-hidden="true"` on the wrapper.
- If both `IconImage` and `IconClass` are empty, no visual is rendered above the title.

### Image Mode

Image mode is active only when `VisualType` equals `image`.

- The card receives `.oc-service-cards-card-image-mode`.
- If `CardImage` is set, it renders as a top image inside `.oc-service-cards-card-image-wrap`.
- The image area uses a `16 / 9` aspect ratio and a `10rem` height.
- The image uses `object-fit: cover` and the selected `CardImagePosition` value as inline `object-position`.
- Invalid or missing `CardImagePosition` values fall back to `center center` before rendering.
- Top image corners inherit the card border radius, with bottom image corners squared off.
- The image is decorative: `alt=""`, `loading="lazy"`, and `decoding="async"`.
- If `CardImage` is missing, no `<img>` tag is rendered, so the browser does not show a broken image.

### Link Wrapping

When `Link.Url` has a value, the entire card renders as an anchor.

- The linked card keeps inherited color and removes text decoration in normal, hover, and focus states.
- The anchor receives `aria-label` from the card `Title`.
- If the card title is empty, the `aria-label` is also empty; keep linked cards titled.

### Scroll Reveal And Motion

Reveal behavior is controlled by `HeadingAnimation`, `IntroAnimation`, and `CardsAnimation`.

- Non-`none` values add `data-oc-service-cards-reveal="..."` to the rendered item.
- JavaScript adds `.oc-service-cards-reveal-enabled` only when reveal items exist.
- `IntersectionObserver` reveals all items when the section enters the viewport at threshold `0.15` with bottom root margin `-10%`.
- Cards reveal sequentially through `--oc-service-cards-reveal-delay`, increasing by `140ms` per card.
- Image-mode cards keep native lazy loading, but the reveal class is applied only after the card image has loaded or errored so the scroll animation does not expose grey placeholders.
- If `IntersectionObserver` is unavailable, the reveal flow runs immediately.
- If the user prefers reduced motion, the reveal flow runs immediately and CSS disables transitions.
- With JavaScript disabled, reveal-enabled CSS is never activated, so content remains visible.

## Usage Recipes

### Icon Card Grid

Use this when the cards represent abstract services, capabilities, or categories.

1. Set each card `Visual Type` to `Icon`.
2. Use `IconClass` such as `fas fa-check`, or choose a small `IconImage`.
3. Keep titles short and descriptions similar in length for a balanced grid.

### Image Card Grid

Use this when each card benefits from a visual example, location, product, or environment image.

1. Set each card `Visual Type` to `Image`.
2. Upload/select `CardImage` from `Content/OpenContent/ServiceCards/`.
3. Set `Card Image Position` to keep the desired source-image area visible inside the crop, such as `Top Center` or `Center Center`.
4. Use landscape images with a clear focal point.

### Mixed Icon/Image Cards

Use this when some capabilities need photos and others are better represented by icons.

1. Set `Visual Type` independently per card.
2. Keep card titles and descriptions consistent so mixed visuals still scan as one grid.
3. Verify the final page on mobile, where all cards become one column.

### Linked Cards

Use this when each card is a navigation choice.

1. Add a value to `Link.Url`.
2. Confirm the card title clearly describes the link destination.
3. Test click, keyboard tab focus, and destination behavior.

### No-Animation Static Grid

Use this for dense pages, performance-sensitive pages, or pages where motion is distracting.

1. Set `HeadingAnimation` to `none`.
2. Set `IntroAnimation` to `none`.
3. Set `CardsAnimation` to `none`.

## Asset Guidance

| Asset | Recommendation |
|---|---|
| `CardImage` | Use landscape images close to 16:9. Recommended minimum: `1200 x 675` for sharp desktop rendering. Use `CardImagePosition` when the source image focal point is not centered. |
| `IconImage` | Use square or near-square transparent PNG/SVG-style assets when possible. The display box is `3.25rem x 3.25rem` with `object-fit: contain`. |
| `IconClass` | Use classes supported by the icon font loaded by the site, typically FontAwesome classes such as `fas fa-check`. |
| WebP | WebP works only if DNN allows the extension globally. If upload or rendering fails, check DNN file extension settings. |

## Accessibility Notes

- The section uses `aria-label`, preferring `ModuleTitle`, then `SectionHeading`, then `Service cards`.
- The visible section heading renders as `h2`; confirm this fits the page heading hierarchy.
- Card titles render as `h3`.
- FontAwesome icons and card images are decorative in the current template. Card images render with empty alt text.
- Linked cards use the card `Title` as their `aria-label`; always provide meaningful linked-card titles.
- Linked cards are native anchors, so keyboard navigation uses standard browser behavior.
- The CSS currently does not add a custom focus ring. Verify the site theme provides a visible focus indicator.
- Reduced-motion users bypass reveal animation and hover movement.
- Because heading, intro, title, and description are rendered as raw HTML, editors should use valid, semantic markup and avoid duplicating heading levels inside these fields.

## Troubleshooting

| Problem | Check |
|---|---|
| Icon fields are not visible | Set `Visual Type` to `Icon`. `IconClass` and `IconImage` are hidden when `Visual Type` is `Image`. |
| `CardImage` or `CardImagePosition` is not visible in the editor | Set `Visual Type` to `Image`. Image fields are hidden in icon mode. |
| Image mode card has no image | Confirm `CardImage` is selected and the file exists. The template intentionally skips the `<img>` tag when no image URL is available. |
| Image crop shows the wrong area | Adjust `Card Image Position`; for example, use `Top Center` when important content is near the top of the source image. |
| Image upload fails or WebP does not work | Confirm the extension is allowed globally in DNN file extension settings. |
| Icon does not show | Confirm the site loads the expected icon font and that `IconClass` matches a real icon class. If `IconImage` is set, it takes priority over `IconClass`. |
| Reveal animation is not visible | Confirm the relevant animation setting is not `none`. Also check reduced-motion browser settings and whether the section is already in view when the page loads. |
| Reveal animation feels too fast or too slow | Timing is controlled in `template.css`; card staggering is currently `140ms` per card in `template.cshtml`. |
| Old styles remain after editing CSS | Clear DNN/client cache, recycle the site if needed, and hard-refresh the browser. |
| Anchor link does not work | Confirm `ModuleAnchor` contains only letters, numbers, and hyphens, and that the link includes the matching `#anchor`. |

## Manual QA Checklist

- [ ] Add the template to a page through OpenContent.
- [ ] Confirm the section renders when heading, intro, or cards exist.
- [ ] Confirm `ModuleAnchor` creates a working anchor target when populated.
- [ ] Confirm icon cards render `IconImage` before `IconClass`.
- [ ] Confirm default icon cards use `VisualType = icon` and `IconClass = fas fa-check` for new/default data.
- [ ] Confirm image cards render a top `CardImage` with no broken image when `CardImage` is empty.
- [ ] Confirm image cards respect `CardImagePosition` and invalid values fall back to `center center`.
- [ ] Confirm cards with `Link.Url` render as clickable full-card anchors.
- [ ] Confirm cards without `Link.Url` render as non-linked articles.
- [ ] Confirm `CardsPerRow` supports one, two, three, and four desktop columns; tablet caps at two columns and mobile uses one column.
- [ ] Confirm background, container, card color, min height, border radius, shadow, icon color, margin, and padding settings apply as expected.
- [ ] Confirm animation settings work for heading, intro, and cards.
- [ ] Confirm `none` disables reveal attributes for the selected element group.
- [ ] Confirm reduced-motion mode reveals content immediately and disables motion.
- [ ] Confirm keyboard focus is visible for linked cards.
- [ ] Confirm DNN cache is cleared after CSS or template edits.
