# Upendo Technical Insights Articles

Reusable DNN/OpenContent template for an editorial technical insights section.

## Structure

- Header with optional section heading, divider, issue label, and intro text.
- Large featured article card on the left with optional image, overlay, category, title, description, and CTA text.
- Right-side stack of smaller article cards with category, title, and description.

## Editing Notes

- `ModuleAnchor` accepts letters, numbers, and hyphens only.
- `SectionHeadingElement` should match the page outline.
- `FeaturedArticle.ImageAlt` should describe meaningful image content. Leave it empty only when the image is decorative.
- Article URLs allow anchors, single slash-relative URLs, `http`, `https`, `mailto`, and `tel`. Protocol-relative URLs are rejected.
- `_blank` links automatically render with `rel="noopener noreferrer"`.

## Template Settings

Settings are intentionally minimal and ordered alphabetically by field name:

- `BackgroundColorClass`
- `CardCorners`
- `ContainerWidth`
- `MarginBottom`
- `MarginTop`
- `PaddingBottom`
- `PaddingTop`
- `SideAccentStyle`

## Accessibility

- The section uses `aria-labelledby` when a visible heading exists.
- If no heading is set, the section falls back to `SectionAriaLabel`, then `ModuleTitle`.
- Featured and side cards render as semantic `article` elements.
- Each linked card uses a single anchor wrapper, avoiding nested links.
- Focus states are visible for keyboard users.
- Featured image motion is disabled for users who prefer reduced motion.
