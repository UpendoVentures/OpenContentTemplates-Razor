# Upendo Resource Hub Hero

## Overview

`Upendo-Resource-Hub-Hero` is a reusable OpenContent hero template for resource, knowledge, documentation, or insight landing sections. It renders a semantic hero with an optional eyebrow, configurable heading level, intro copy, optional CTA links, a real image card, fixed decorative motif treatment, and an overlapping status badge.

The template is intentionally generic. Default copy follows the resource-hub visual target, but all editor-facing fields can be reused for other knowledge, article, download, or capability-entry sections.

## Quick Start

1. Add an OpenContent module to the page.
2. Select the `Upendo-Resource-Hub-Hero` template.
3. In Content Edit, enter the eyebrow, heading, intro text, image, optional status card copy, and choose `With CTAs` only when CTA buttons are needed. Enable `Image Settings` only when image alt text or focal-position fields need editing. Enable `Status Card` only when status card fields need editing.
4. Choose the correct `Heading Element` for the page outline.
5. Open Template Settings to adjust shared background utility, container width, spacing utilities, image position, and image treatment.
6. Verify desktop, tablet, and mobile layouts.

## Editor Organization

The OpenContent editor files are organized by field order and helper text because nearby templates do not use a supported fieldset or tab convention.

Content Edit is ordered as: admin / identification, text content, image, optional image settings, optional status card fields, section accessibility label, CTA mode, then conditional CTA fields.

Template Settings are ordered as: layout, spacing, background, then image styling. Legacy visual settings are no longer shown for new content, but the renderer still handles saved legacy values for existing modules.

## File Overview

| File | Purpose |
| --- | --- |
| `template.cshtml` | Razor renderer for content, settings allow-lists, semantic section labeling, links, image card, image treatment, motif, status badge, and shared utility classes. |
| `template.css` | Scoped styles for `.oc-resource-hub-hero` and `.oc-rhh-*` classes, mapped to Bootstrap/site tokens for colors, typography, focus states, motif, CTAs, image card, badge, and reduced-motion behavior. |
| `schema.json` | Content Edit schema for copy, CTAs, image, badge, and accessibility fields. |
| `options.json` | Content Edit UI helpers, placeholders, upload folder, select labels, and editor behavior. |
| `data.json` | Default Content Edit data. |
| `template-schema.json` | Template Settings schema for layout and visual controls. |
| `template-options.json` | Template Settings UI helpers and select labels. |
| `template-data.json` | Default Template Settings data. |
| `README.md` | Maintainer and editor documentation. |

## Accessibility Notes

The root output is a semantic `<section>`. When `Heading` is present, the section receives `aria-labelledby` pointing to the rendered heading. When no heading exists, the template uses `SectionAriaLabel` if provided.

The heading element is allow-listed to `h1` through `h6`. `With CTAs` defaults to `None`, which hides CTA fields in Content Edit and renders no CTA buttons even if legacy CTA text or URLs exist. `With One CTA` shows and allows only the primary CTA. `With Two CTAs` shows and allows both CTA buttons. Active CTAs render only when both text and URL exist. CTA URLs allow relative paths, anchors, `http`, `https`, `mailto`, and `tel` schemes; unsupported schemes are not rendered. Links opening in a new tab receive `rel="noopener noreferrer"`. The image uses `<img>`, configurable alt text, `loading="lazy"`, and `decoding="async"`. The status card renders visible label, text, and optional description; `StatusAriaLabel` is used only as the card's accessible label when provided. The motif is decorative and marked `aria-hidden="true"`. Focus-visible styles are included for keyboard users.

`Primary CTA Icon` and `Secondary CTA Icon` accept free-text Font Awesome class lists, such as `fas fa-home` or `far fa-file-alt`. Leave either field empty or enter `none` to render no icon. The renderer sanitizes each value before output and only keeps letters, numbers, hyphens, underscores, and spaces; unsafe characters are stripped before the class list is added to the decorative icon element.

## Settings

This template follows the site design system: it inherits the site font, maps local CSS variables to Bootstrap/site tokens such as `--bs-primary`, `--bs-light`, and `--bs-dark`, uses shared background and spacing utility settings, renders CTA anchors with Bootstrap `.btn` and `.rounded-pill`, and keeps the hero heading close to the site hero scale and weight.

Legacy settings such as `BackgroundStyle`, `VerticalSpacing`, motif style, image-card style, and badge style remain handled internally by `template.cshtml` so existing content keeps rendering. They are intentionally not exposed in Template Settings for new content.

| Setting | Default | Allowed values |
| --- | --- | --- |
| `BackgroundColorClass` | `bg-light` | Shared Bootstrap/site background classes, including `bg-primary`, `bg-light`, `bg-dark`, `bg-white`, `bg-mist`, and related theme utilities |
| `ContainerWidth` | `container-xxl` | `container`, `container-lg`, `container-xl`, `container-xxl`, `container-fluid` |
| `ImagePosition` | `right` | `right`, `left`, `hidden-desktop` |
| `MarginTop` | `mt-0` | blank, `mt-0`, `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-auto` |
| `MarginBottom` | `mb-0` | blank, `mb-0`, `mb-1`, `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-auto` |
| `PaddingTop` | `pt-5` | blank, `pt-0`, `pt-1`, `pt-2`, `pt-3`, `pt-4`, `pt-5`, `pt-auto` |
| `PaddingBottom` | `pb-5` | blank, `pb-0`, `pb-1`, `pb-2`, `pb-3`, `pb-4`, `pb-5`, `pb-auto` |
| `ImageTreatment` | `grayscale` | `grayscale`, `color` |

All settings are validated in `template.cshtml` before they become classes or rendered attributes. If both `PaddingTop` and `PaddingBottom` are blank, the renderer falls back to the legacy `VerticalSpacing` class.
