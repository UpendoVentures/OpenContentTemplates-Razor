# Upendo Hero Header Advanced

## Overview

`Upendo-Hero-Header-Advanced` is a reusable OpenContent hero header template for DNN sites. It renders an optional compact title section above a larger hero area with editable heading, sub-heading, body copy, background media, layout controls, overlay settings, and accessibility labeling.

Use this template when a page needs a reusable hero that can switch between a solid color, image, or video background without changing Razor or CSS. The template keeps content-specific media controls in Content Edit and keeps general layout controls in Template Settings, which makes the module reusable across pages and easier to maintain.

## Quick Start

1. Add an OpenContent module to the target page.
2. Select the `Upendo-Hero-Header-Advanced` template.
3. Open Content Edit.
4. Enter the hero title, heading, optional sub-heading, and body copy.
5. Choose `Background Media Type`:
   - `Background Color` for a simple solid-color hero.
   - `Image` for a photographic or illustrated background.
   - `Video` for an autoplaying decorative video background.
6. Fill in only the fields shown for the selected background mode.
7. Open Template Settings if you need to adjust alignment, column width, top spacing, minimum height, overlay, text color mode, or margin/padding utilities.
8. Save and verify the hero on desktop, tablet, and mobile.

## File Overview

| File | Purpose |
| --- | --- |
| `template.cshtml` | Razor renderer. Reads content and settings, validates allowed values, builds CSS classes and inline CSS variables, renders title, hero content, image/color/video backgrounds, overlay, and accessibility attributes. |
| `template.css` | Scoped CSS for `.oc-hero-header-advanced` and `.oc-hha-*` classes. Handles layout, text color, media positioning, overlays, parallax behavior, mobile video fallback, and reduced-motion behavior. |
| `schema.json` | Content Edit schema. Defines editor-facing content fields such as title text, hero copy, background mode, media fields, color fields, video controls, and accessibility label. |
| `options.json` | Content Edit UI options. Defines input types, helper text, placeholders, conditional field visibility, option labels, and upload folder behavior. |
| `data.json` | Default Content Edit data used when the template is first added. |
| `template-schema.json` | Template Settings schema. Defines layout, overlay, text color mode, and spacing utility settings. |
| `template-options.json` | Template Settings UI options. Defines select labels, helper text, and conditional overlay setting visibility. |
| `template-data.json` | Default Template Settings data used when the template is first added. |

## Content Edit Fields

Content Edit is the source of truth for copy, background media, and media-specific controls.

### Module and Admin Fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `ModuleTitle` | Text | `Hero Header Advanced` | Administrator-facing title for identifying the content block. It does not render for site visitors. |
| `ModuleAnchor` | Text | Empty | Optional page anchor. Must contain only letters, numbers, and hyphens because `schema.json` enforces `^[a-zA-Z0-9\-]+$`. When populated, the template renders `<div id="..."></div>` before the hero wrapper. |

### Title Section Fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `TitleVisible` | Boolean | `true` | Controls whether the compact title section above the hero can render. |
| `TitleText` | Text | `Hero Section` | Required by `schema.json`. Renders only when `TitleVisible` is `true` and the value is not blank. |
| `TitleHeadingLevel` | Select | `h1` | Allowed values: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`. Controls the semantic heading tag used for `TitleText`. |
| `TitleSectionBackgroundColor` | Text | `#f5f5f5` | Six-digit hex background color for the compact title section. Pattern: `^#[0-9a-fA-F]{6}$`. The Razor renderer also validates the value and falls back to `#f5f5f5` if invalid. |
| `TitleSectionTextColor` | Text | `#000000` | Six-digit hex text color for the compact title section title text. Pattern: `^#[0-9a-fA-F]{6}$`. The Razor renderer also validates the value and falls back to `#000000` if invalid. |

When `Show Title Section` is off, `TitleText`, `TitleHeadingLevel`, `TitleSectionBackgroundColor`, and `TitleSectionTextColor` are hidden in the editor and the top title section is not rendered. Use this when the page already has an equivalent visible title.

### Hero Content Fields

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `HeroHeading` | Text | `Your hero headline goes here` | Required by `schema.json`. Renders inside the hero as `.oc-hha-heading` when not blank. |
| `HeroHeadingLevel` | Select | `h2` | Allowed values: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`. Use a heading level that fits the page outline. Use `p` only when the text is visually prominent but should not be part of the heading hierarchy. |
| `HeroSubHeading` | Text | `Your hero sub-heading goes here` | Optional supporting line. Renders inside the hero as `.oc-hha-subheading` when not blank, between the main heading and body copy. |
| `HeroSubHeadingLevel` | Select | `h3` | Allowed values: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`. Use a semantic level below the main hero heading unless the page outline requires otherwise. Use `p` when the sub-heading should not create a heading in the document outline. |
| `HeroBody` | Textarea | Introductory default copy | Required by `schema.json`. HTML is allowed and rendered inside `.oc-hha-body` using `Html.Raw`. |

### Background Mode Selector

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `BackgroundMediaType` | Select | `color` in `schema.json` and `data.json` | Allowed values: `color`, `image`, `video`. The editor labels these as `Background Color`, `Image`, and `Video`. This field controls which background-specific fields appear and which rendering path is used. |

### Background Color Fields

Visible when `BackgroundMediaType` is `color`.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `BackgroundColor` | Text | `#ffffff` | Six-digit hex background color. Pattern: `^#[0-9a-fA-F]{6}$`. The Razor renderer also validates the value and falls back to `#ffffff` if invalid. |
| `BackgroundColorTextColor` | Text | `#000000` | Six-digit hex text color. Pattern: `^#[0-9a-fA-F]{6}$`. The Razor renderer also validates the value and falls back to `#000000` if invalid. |

These are text fields, not color picker fields, because no safe OpenContent/Alpaca color picker field type has been confirmed for this project.

### Image Fields

Visible when `BackgroundMediaType` is `image`.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `HeroBackgroundImage` | Image | `/Portals/0/Images/Testimonial/uv-testimonial-hero-1920x1005.jpg` | Uses `Content/Heros/` as the upload folder and typeahead folder. Recommended minimum: `1920 x 1000 px`. |
| `BackgroundPosition` | Select | `center center` | Allowed values: `left top`, `left center`, `left bottom`, `center top`, `center center`, `center bottom`, `right top`, `right center`, `right bottom`. Maps to CSS `background-position`. |
| `BackgroundSize` | Select | `cover` | Allowed values: `cover`, `contain`, `auto`. Maps to CSS `background-size`. |
| `BackgroundRepeat` | Select | `no-repeat` | Allowed values: `no-repeat`, `repeat`, `repeat-x`, `repeat-y`. Maps to CSS `background-repeat`. |
| `EnableParallax` | Boolean | `false` | Enables CSS-only fixed background parallax only when an image background exists. The effect is disabled on mobile and for users with reduced-motion preferences. |

### Video Fields

Visible when `BackgroundMediaType` is `video`.

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `VideoSourceType` | Select | `auto` | Allowed values: `auto`, `video`, `youtube`. `auto` detects YouTube URLs automatically. `video` forces the URL to render as a regular video source. `youtube` requires a recognized YouTube URL. |
| `VideoUrl` | Text | Empty | Desktop source. Supports root-relative local paths such as `/Portals/0/Videos/hero-desktop.mp4`, absolute HTTP/HTTPS video URLs, and YouTube URLs. |
| `MobileTabletVideoUrl` | Text | Empty | Optional mobile/tablet source. If valid, it replaces the desktop video at viewport widths up to `991.98px`. If empty or invalid, the desktop video remains active on all sizes. |
| `VideoDisplayMode` | Select | `cover` | Allowed values: `cover`, `contain`, `fill`. `cover` crops to fill the hero, `contain` fits the full video, and `fill` stretches the media. |
| `VideoPosition` | Select | `center` | Allowed values: `center`, `top`, `bottom`, `left`, `right`. Controls object position for video files and iframe placement for cover-mode YouTube embeds. |
| `VideoPlaybackMode` | Select | `loop` | Allowed values: `loop`, `stop`. `loop` adds the `loop` attribute for video files and YouTube loop parameters. `stop` omits looping and lets playback end. |

### Accessibility Label

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `SectionAriaLabel` | Text | Empty | Optional accessible label for the hero `<section>`. When provided, the section receives `aria-label`. When blank and `HeroHeading` exists, the section receives `aria-labelledby` pointing to the generated hero heading ID. |

## Template Settings Fields

Template Settings control general layout, overlay behavior, text color mode, and utility spacing. They should not duplicate media selection controls.

### Alignment

| Field | Default | Allowed values | Notes |
| --- | --- | --- | --- |
| `TitleAlignment` | `left` | `left`, `center`, `right` | Controls only the compact top title section. Adds `.oc-hha-title-align-*` and matching Bootstrap text alignment classes. |
| `ContentAlignment` | `left` | `left`, `center`, `right` | Controls the hero heading and body. Adds `.oc-hha-align-*` and matching Bootstrap text alignment classes. |

### Content Column Layout

| Field | Default | Allowed values | Notes |
| --- | --- | --- | --- |
| `ContentColumnWidth` | `col-md-8` | `col-md-6`, `col-md-7`, `col-md-8`, `col-md-9`, `col-md-10`, `col-md-12` | Bootstrap 3 column width for the hero content column. |
| `ContentColumnOffset` | `col-md-offset-2` | Empty, `col-md-offset-0`, `col-md-offset-1`, `col-md-offset-2`, `col-md-offset-3` | Bootstrap 3 offset for the hero content column. `col-md-offset-0` is normalized to no offset. |

### Hero Spacing and Height

| Field | Default | Allowed values | Notes |
| --- | --- | --- | --- |
| `HeroTopSpacing` | `7em` | `0`, `3em`, `5em`, `7em`, `9em`, `11em` | Sets `--oc-hha-hero-padding-top`, used by `.oc-hha-content` as top padding. The default preserves the legacy hero spacing. |
| `HeroMinHeight` | `auto` | `auto`, `360px`, `480px`, `525px`, `560px`, `640px` | Sets `--oc-hha-hero-min-height`, used by `.oc-hha-hero`. |

### Overlay

| Field | Default | Allowed values | Notes |
| --- | --- | --- | --- |
| `OverlayEnabled` | `false` | Boolean | When enabled, renders `.oc-hha-overlay` above the background media and below the text. |
| `OverlayColor` | `#000000` | `#000000`, `#1f2933`, `#ffffff` | Visible only when `OverlayEnabled` is true. Sets `--oc-hha-overlay-color`. |
| `OverlayOpacity` | `0.3` | `0`, `0.15`, `0.3`, `0.45`, `0.6`, `0.75` | Visible only when `OverlayEnabled` is true. Sets `--oc-hha-overlay-opacity`. |

### Text Color Mode

| Field | Default | Allowed values | Notes |
| --- | --- | --- | --- |
| `TextColorMode` | `dark` in `template-data.json`; Razor fallback is `light` | `light`, `dark`, `theme` | Applies to non-color backgrounds. `light` adds `section-text-light` and `.oc-hha-hero--text-light`; `dark` adds `.oc-hha-hero--text-dark`; `theme` leaves text color to the active theme. Color background mode overrides this setting and uses `BackgroundColorTextColor`. |

### Margin and Padding Utilities

| Field | Default | Allowed values | Notes |
| --- | --- | --- | --- |
| `MarginTop` | `mt-auto` | `mt-0`, `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-auto` | Added to the root `.oc-hero-header-advanced` wrapper. |
| `MarginBottom` | `mb-auto` | `mb-0`, `mb-1`, `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-auto` | Added to the root `.oc-hero-header-advanced` wrapper. |
| `PaddingTop` | `pt-auto` | `pt-0`, `pt-1`, `pt-2`, `pt-3`, `pt-4`, `pt-5`, `pt-auto` | Added to the hero section. |
| `PaddingBottom` | `pb-auto` | `pb-0`, `pb-1`, `pb-2`, `pb-3`, `pb-4`, `pb-5`, `pb-auto` | Added to the hero section. |

## Rendering Behavior

### Root and Child CSS Classes

The outer wrapper always starts with:

```html
<div class="oc-hero-header-advanced what-header">
```

The template uses the `oc-hha-*` namespace for child elements and state classes. Important classes include:

| Class | Purpose |
| --- | --- |
| `.oc-hha-title-section` | Optional compact title section above the hero. |
| `.oc-hha-title` | Top title heading. |
| `.oc-hha-title-align-left`, `.oc-hha-title-align-center`, `.oc-hha-title-align-right` | Title section alignment states. |
| `.oc-hha-hero` | Main hero section. |
| `.oc-hha-hero--has-color` | Solid color background mode. |
| `.oc-hha-hero--has-image` | Image background mode with an image URL. |
| `.oc-hha-hero--no-image` | Added when there is no active image background. |
| `.oc-hha-hero--has-video` | Video background mode with a valid desktop video source. |
| `.oc-hha-hero--has-mobile-tablet-video` | Added when a valid mobile/tablet video source exists. |
| `.oc-hha-hero--has-overlay` | Added when overlay is enabled. |
| `.oc-hha-hero--text-light`, `.oc-hha-hero--text-dark` | Text color state classes. |
| `.oc-hha-hero--fit-cover`, `.oc-hha-hero--fit-contain`, `.oc-hha-hero--fit-fill` | Video display mode state classes. |
| `.oc-hha-hero--position-center`, `.oc-hha-hero--position-top`, `.oc-hha-hero--position-bottom`, `.oc-hha-hero--position-left`, `.oc-hha-hero--position-right` | Video position state classes. |
| `.oc-hha-video-media` | Absolute-positioned decorative video layer. |
| `.oc-hha-video-media--desktop` | Desktop video layer. |
| `.oc-hha-video-media--mobile-tablet` | Mobile/tablet video layer, shown only under `991.98px` when available. |
| `.oc-hha-video`, `.oc-hha-video-frame` | Local/external video element or YouTube iframe. |
| `.oc-hha-overlay` | Overlay layer. |
| `.oc-hha-container` | Content container above background and overlay layers. |
| `.oc-hha-content` | Hero text wrapper. |
| `.oc-hha-heading` | Hero heading. |
| `.oc-hha-subheading` | Optional hero sub-heading between the main hero heading and body copy. |
| `.oc-hha-body` | Hero body copy. |

### Background Color Mode

When `BackgroundMediaType` is `color`, the hero receives `.oc-hha-hero--has-color`. The renderer sets `background-color` inline from `BackgroundColor` and sets `--oc-hha-color-text-color` from `BackgroundColorTextColor`.

Color mode forces the effective text color mode to `dark` internally, but the CSS for `.oc-hha-hero--has-color` overrides heading, body, paragraph, span, strong, emphasis, anchor, and list item colors with `--oc-hha-color-text-color`.

### Title Section Colors

When the compact title section renders, the renderer validates `TitleSectionBackgroundColor` and `TitleSectionTextColor` as six-digit hex colors. Invalid or missing values fall back to `#f5f5f5` for the background and `#000000` for the title text.

The renderer sets `--oc-hha-title-section-bg` and `--oc-hha-title-section-text-color` on `.oc-hha-title-section`. The CSS applies the background variable to the title section container and the text color variable only to `.oc-hha-title`, without changing the hero background mode or hero text colors.

### Image Mode and Parallax

When `BackgroundMediaType` is `image` and `HeroBackgroundImage` is not blank, the hero receives `.oc-hha-hero--has-image`. The image URL is rendered as an inline `background-image`, and the position, size, and repeat values are assigned through CSS variables.

When `EnableParallax` is true and a background image exists, the hero also receives `parallax section-parallax`, and CSS applies `background-attachment: fixed`. This effect is disabled below `767px` and under `prefers-reduced-motion: reduce`.

### Video Mode

When `BackgroundMediaType` is `video` and `VideoUrl` is valid, the hero receives `.oc-hha-hero--has-video` plus fit and position classes. Video media is decorative and rendered with `aria-hidden="true"`, `tabindex="-1"`, and `pointer-events: none`.

Valid video URLs are root-relative local paths beginning with `/` or absolute `http`/`https` URLs. Values containing `<` or `>` are rejected.

For local or external video files, the template renders a `<video>` element with:

```html
autoplay muted playsinline preload="metadata"
```

When `VideoPlaybackMode` is `loop`, the `loop` attribute is added. When the mode is `stop`, no loop attribute is added.

For YouTube URLs, the template renders a `youtube-nocookie.com` iframe with autoplay, mute, controls disabled, playsinline, modest branding, related videos disabled, keyboard controls disabled, and annotations disabled. In `loop` mode, the template adds both `loop=1` and `playlist={videoId}`, which YouTube requires for single-video looping.

If `MobileTabletVideoUrl` is valid, a second decorative video layer is rendered. CSS hides the desktop layer and shows the mobile/tablet layer at widths up to `991.98px`. If no valid mobile/tablet URL is provided, the desktop source is used at every breakpoint.

### Overlay Stacking

The background media layer uses `z-index: 0`. The overlay uses `z-index: 1`. The text container uses `z-index: 2`. This keeps content readable and clickable while the background media remains decorative.

### Fallback and Backward Compatibility

Several fields now belong in Content Edit, but `template.cshtml` still checks old Template Settings values as fallbacks where relevant:

| Current Content Edit field | Old settings fallback checked by renderer |
| --- | --- |
| `BackgroundMediaType` | `Model.Settings.BackgroundMediaType` |
| `BackgroundColor` | `Model.Settings.BackgroundColor` |
| `BackgroundPosition` | `Model.Settings.BackgroundPosition` |
| `BackgroundSize` | `Model.Settings.BackgroundSize` |
| `BackgroundRepeat` | `Model.Settings.BackgroundRepeat` |
| `VideoDisplayMode` | `Model.Settings.VideoDisplayMode` |
| `VideoPosition` | `Model.Settings.VideoPosition` |
| `VideoPlaybackMode` | `Model.Settings.VideoPlaybackMode` |
| `EnableParallax` | `Model.Settings.EnableParallax` |

This fallback behavior helps existing modules continue rendering after the controls were moved into Content Edit. New edits should use the current Content Edit fields.

## Usage Recipes

### Solid Color Hero

Use this for simple page introductions or sections where brand color matters more than photography.

1. Set `Background Media Type` to `Background Color`.
2. Set `Background Color` to a six-digit hex value, for example `#ffffff`.
3. Set `Background Color Text Color` to a readable six-digit hex value, for example `#000000`.
4. Use Template Settings to adjust alignment, column width, and spacing.
5. Verify contrast between background and text.

### Image Hero

Use this for editorial, landing page, or brand storytelling headers.

1. Set `Background Media Type` to `Image`.
2. Choose a wide landscape image in `Hero Background Image`.
3. Leave `Background Size` as `cover` for most hero designs.
4. Adjust `Background Position` to keep the important subject visible.
5. Enable `Overlay` if text needs stronger contrast.
6. Enable `Parallax` only if the motion adds value and does not harm readability.

### Video Hero With Mobile Fallback

Use this only when motion supports the message and the video can remain decorative.

1. Set `Background Media Type` to `Video`.
2. Set `Video Source Type` to `Auto Detect` unless you need to force a specific renderer.
3. Add a desktop MP4 or YouTube URL in `Desktop Video URL`.
4. Add a shorter or smaller mobile/tablet source in `Mobile/Tablet Video URL`.
5. Keep `Video Display Mode` as `Crop to Fill` for most hero backgrounds.
6. Set `Video Position` to keep the key visual area visible when cropped.
7. Use `Loop Infinitely` for seamless ambient loops or `Stop at End` when repetition is distracting.
8. Add an overlay if the text needs more contrast.

### Accessible Hero With Custom ARIA Label

Use this when the visible hero heading is not enough to describe the section purpose.

1. Enter clear hero heading and body copy.
2. Set `Hero Heading Level` according to the page outline.
3. Add `Section Aria Label`, for example `Services overview hero`.
4. Verify that the label describes the section, not the decorative background image or video.

## Recommended Image and Video Guidelines

### Images

| Asset | Recommendation |
| --- | --- |
| Desktop hero image | Minimum `1920 x 1000 px`; use a wide landscape composition. |
| Focal area | Keep important subjects away from extreme edges because `cover` may crop on smaller screens. |
| File size | Compress for web delivery while preserving readability behind text. |
| Contrast | Use an overlay or a less busy image when text is hard to read. |

### Videos

| Asset | Recommendation |
| --- | --- |
| Desktop video | Use a wide `16:9` or wider MP4. A practical target is `1920 x 1080`. |
| Mobile/tablet video | Use a smaller or portrait-friendly crop. Practical targets include `1080 x 1350`, `1080 x 1920`, or a compressed `1280 x 720` fallback depending on the design. |
| Duration | Keep decorative loops short and lightweight. |
| Audio | Do not rely on audio. The template mutes videos to support autoplay. |
| Autoplay | Browser autoplay generally requires `muted` and `playsinline`; the template includes both. |
| YouTube | YouTube embeds are less controllable than local MP4 files and may be affected by platform behavior, network conditions, privacy tools, or browser policies. |

## Accessibility and SEO Notes

| Topic | Guidance |
| --- | --- |
| Heading levels | Choose `TitleHeadingLevel` and `HeroHeadingLevel` based on the page outline, not visual size. Avoid multiple `h1` elements unless the page structure intentionally requires them. |
| Paragraph hero heading | The `p` option for `HeroHeadingLevel` is useful when text should look like a hero headline but should not create a semantic heading. |
| Sub-heading levels | Choose `HeroSubHeadingLevel` based on the page outline. The default is `h3`, which sits below the default `h2` hero heading. |
| ARIA label | If `SectionAriaLabel` is populated, the hero section uses `aria-label`. If it is blank and `HeroHeading` exists, the section uses `aria-labelledby` pointing to the hero heading. |
| Decorative media | Background images and videos are decorative. Video wrappers are `aria-hidden`, and videos/iframes are removed from keyboard navigation with `tabindex="-1"`. Do not put essential information only inside background media. |
| Body HTML | `HeroBody` allows HTML. Keep markup meaningful and avoid using purely visual elements when semantic HTML is available. |

## Troubleshooting

| Problem | Likely cause | Fix |
| --- | --- | --- |
| Background fields are not appearing. | The wrong `Background Media Type` is selected. Fields are conditionally shown by `options.json`. | Select `Background Color`, `Image`, or `Video` to reveal the relevant fields. |
| Image fields are hidden. | `Background Media Type` is not set to `Image`. | Change the selector to `Image`. |
| Video fields are hidden. | `Background Media Type` is not set to `Video`. | Change the selector to `Video`. |
| Video does not autoplay. | Browser autoplay policies, invalid URL, blocked iframe/video, unsupported format, or media not muted by the platform. | Use a valid root-relative or absolute HTTP/HTTPS URL. Prefer MP4 for local/external files. Confirm the rendered video has `autoplay`, `muted`, and `playsinline`. |
| YouTube video does not loop. | YouTube requires a `playlist` parameter matching the video ID for single-video looping. | Use `Video Playback Mode = Loop Infinitely`. The renderer adds the required `playlist` value when it can parse the video ID. |
| Mobile video is not showing. | `MobileTabletVideoUrl` is empty or invalid, or the viewport is wider than `991.98px`. | Add a valid mobile/tablet URL and test below `991.98px`. |
| Title section text color does not change. | `Show Title Section` is off, `TitleText` is blank, the value is not a six-digit hex color, or cached CSS/markup is still being served. | Enable `Show Title Section`, enter title text, use a value such as `#000000`, save, then clear DNN/browser cache if needed. |
| Text color setting has no effect in color mode. | Color mode intentionally uses `BackgroundColorTextColor`. | Edit `Background Color Text Color` in Content Edit. |
| New CSS is not visible after editing. | DNN, browser, or server-side caching may still be serving old `template.css`. | Clear DNN cache, recycle the app if needed, and hard-refresh the browser. |
| Color values are rejected or fall back. | Color fields require six-digit hex input. No safe color picker was confirmed for this OpenContent/Alpaca setup. | Use values such as `#ffffff`, `#000000`, or `#1f2933`. |

## Manual QA Checklist

- Confirm the module renders with the default `data.json` and `template-data.json` values.
- Confirm the optional title section renders when `Show Title Section` is enabled and `TitleText` is populated.
- Confirm `Title Section Background Color` appears only when `Show Title Section` is enabled.
- Confirm `Title Section Text Color` appears only when `Show Title Section` is enabled.
- Confirm the title section background uses `TitleSectionBackgroundColor` and invalid values fall back safely.
- Confirm the compact title section title text uses `TitleSectionTextColor` and invalid values fall back safely.
- Confirm `TitleSectionTextColor` affects only `.oc-hha-title`, not hero heading or hero body text.
- Confirm the title section does not render when `Show Title Section` is disabled.
- Confirm each `Title Heading Level` renders the expected semantic tag.
- Confirm each `Hero Heading Level`, including `Paragraph`, renders the expected tag.
- Confirm each `Hero Sub-Heading Level`, including `Paragraph`, renders the expected tag.
- Confirm blank `HeroSubHeading` does not render `.oc-hha-subheading`.
- Confirm populated `HeroSubHeading` renders between `.oc-hha-heading` and `.oc-hha-body`.
- Confirm `HeroBody` supports expected HTML and does not create unwanted spacing after the last child.
- Confirm `ModuleAnchor` renders an anchor when populated with a valid value.
- Confirm color background mode applies both `BackgroundColor` and `BackgroundColorTextColor`.
- Confirm invalid hex colors fall back safely.
- Confirm image background mode applies image URL, position, size, and repeat.
- Confirm parallax works on desktop when enabled and is disabled on mobile and reduced-motion settings.
- Confirm video mode renders local/external video files.
- Confirm video mode renders supported YouTube URLs.
- Confirm mobile/tablet video replaces desktop video below `991.98px` when provided.
- Confirm `Loop Infinitely` loops video files and adds YouTube loop parameters.
- Confirm `Stop at End` omits the video file `loop` attribute.
- Confirm overlay appears above background media and below text.
- Confirm `OverlayColor` and `OverlayOpacity` only appear when overlay is enabled.
- Confirm `TextColorMode` affects image and video backgrounds.
- Confirm color mode uses `BackgroundColorTextColor` instead of `TextColorMode`.
- Confirm content alignment and title alignment work independently.
- Confirm Bootstrap column width and offset settings produce the expected layout.
- Confirm margin and padding utility classes are added to the intended wrapper or hero element.
- Confirm `SectionAriaLabel` creates `aria-label`.
- Confirm blank `SectionAriaLabel` with a hero heading creates `aria-labelledby`.
- Confirm background media remains decorative and is not keyboard-focusable.
- Confirm the hero is readable on desktop, tablet, and mobile.
- Clear DNN/browser cache and confirm the latest CSS is being served.
