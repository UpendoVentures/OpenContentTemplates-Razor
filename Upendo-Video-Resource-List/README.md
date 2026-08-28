# Upendo Video Resource List

Independent DNN/OpenContent template for a video resources page. It renders a simple responsive video resources section using privacy-friendly YouTube embeds when a valid YouTube ID can be parsed.

## Quick Path

1. Add an OpenContent module to `/resources/videos`.
2. Select `Upendo-Video-Resource-List` and load the default data if needed.
3. Replace the draft sample videos with approved titles, descriptions, YouTube URLs, thumbnails, categories, and tags.

## Layout Settings

- `BackgroundColorClass`: controls the outer section background. Includes theme-friendly labels such as `Soft Gray` for `bg-soft-gray`.
- `ContainerClass`: controls the inner content width. Default is `container-xxl`; runtime accepts `container`, `container-sm`, `container-md`, `container-lg`, `container-xl`, `container-xxl`, and `container-fluid`.
- `DisplayMode`: `grouped` keeps category sections and anchor navigation; `grid` renders all videos in one unified card grid.
- `CardsPerRow`: choose `2` or `3` desktop columns. Mobile always renders one column.
- `CompactSpacing`: reduces intro, category, and card gaps for denser pages.
- `ShowBackToTop`: controls the small category heading link in grouped mode.

## Card Layout Behavior

- Cards in the same desktop row are designed to keep their internal content visually aligned.
- Category and title areas reserve consistent vertical space on desktop so descriptions start at a predictable rhythm.
- Tags are anchored near the lower action area, directly above the CTA button.
- CTA buttons stay at the bottom of each card when cards have different title or description lengths.
- Mobile cards relax the desktop alignment rules to avoid unnecessary empty space on narrow screens.

## Content Editing Notes

- `ModuleAnchor` accepts letters, numbers, and hyphens only.
- `YouTubeUrl` supports common watch, `youtu.be`, `/embed/`, and `/shorts/` URL formats.
- Valid YouTube URLs render through `https://www.youtube-nocookie.com/embed/{id}`.
- `ThumbnailImage` is a fallback for missing or unparseable YouTube URLs.
- `Tags` is a comma-separated text field, intentionally not a lookup, so the template remains independent.
- `_blank` CTA links automatically render with `rel="noopener noreferrer"`.
- Add multiple videos with the same `Category` to render multiple cards inside one grouped section.

## Accessibility

- The section renders a visible heading when `SectionHeading` is configured.
- If no visible heading exists, a visually hidden heading falls back to `ModuleTitle`.
- Every YouTube iframe receives a title based on the video title.
- Video embeds use a responsive aspect-ratio wrapper.
- Fallback thumbnail links receive accessible labels.

## Out Of Scope

- No custom DNN module.
- No dynamic routing.
- No heavy JavaScript filtering.
- No shared lookup data dependencies.
