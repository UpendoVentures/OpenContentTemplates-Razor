# Upendo Marquee Section

Reusable OpenContent marquee/scrolling strip for repeated text + icon items or logo image items. Use it for partner logo strips, service highlights, capability lists, or any short horizontal content loop that should feel lightweight and decorative while still supporting accessible labels and optional links.

## Quick Start

1. Add an OpenContent module to the target DNN page.
2. Select the `Upendo-Marquee-Section` template.
3. In Content Edit, set a `Module Title` for the section's accessible label.
4. Add `Marquee Items`.
5. For each item, choose `Item Type`:
   - `Text + Icon` for text with an optional icon font class.
   - `Logo Image` for a standalone logo asset.
6. Enable `With Link` only for items that should navigate somewhere.
7. In Template Settings, confirm color, speed, direction, spacing, logo height, edge fade, and pause behavior.
8. Verify that the marquee animates, pauses on hover/focus when enabled, and remains usable with reduced motion enabled.

## File Overview

| File | Purpose |
|---|---|
| `template.cshtml` | Razor renderer. Builds the section markup, CSS variable values, cloned groups, item rendering, link safety attributes, and legacy fallbacks. |
| `template.css` | Component styles, animation keyframes, fade mask, responsive adjustments, pause behavior, and reduced motion behavior. |
| `schema.json` | Content Edit data schema for module fields and marquee items. |
| `options.json` | Content Edit UI configuration, helpers, accordion behavior, image picker setup, labels, and conditional field visibility. |
| `data.json` | Default content example with text + icon items. |
| `template-schema.json` | Template Settings schema for colors, sizing, spacing, speed, direction, and layout utility classes. |
| `template-options.json` | Template Settings UI configuration, helpers, option labels, and select/checkbox controls. |
| `template-data.json` | Default Template Settings values. |

## Content Edit Field Reference

### Module Fields

| Field | Type | Default | Behavior |
|---|---:|---|---|
| `ModuleTitle` | string | `Marquee Section` in `data.json` | Administrator-facing title. Razor uses it as `aria-label` on the `<section>` when present. |
| `ModuleAnchor` | string | empty | Optional page anchor. Must match `^[a-zA-Z0-9\-]+$`. Razor renders a separate `<div id="..."></div>` before the section when present. |
| `Items` | array | six text + icon examples | Required list of marquee items. Display order follows editor order. `options.json` renders this as an accordion. |

### `Items` Accordion

`Items` is configured as an accordion in `options.json`:

| Setting | Value |
|---|---|
| UI type | `accordion` |
| Accordion title field | `ItemLabel` |
| Helper | `Add as many marquee items as needed. Items display in the order shown here.` |

### Item Fields

| Field | Type | Default | Visibility | Rendered publicly? | Notes |
|---|---:|---|---|---|---|
| `ItemLabel` | string | `Item` | Always visible | No | Editor-only label used in the accordion header. Keep this out of public rendering. |
| `ItemType` | enum string | `text-icon` | Always visible | Indirectly | Options are `text-icon` and `logo-image`; UI labels are `Text + Icon` and `Logo Image`. |
| `Text` | string | empty | Only when `ItemType` is `text-icon` | Yes | Visible text for text + icon items. |
| `IconClass` | string | empty | Only when `ItemType` is `text-icon` | Yes | Optional icon font class, for example `fas fa-bolt`, if the active theme loads that icon font. |
| `LogoImage` | image/string | empty | Only when `ItemType` is `logo-image` | Yes | Image picker uploads/browses under `Content/Logos/`. Rendered as `<img class="oc-ms-logo">`. |
| `WithLink` | boolean | `false` | Always visible | Indirectly | Enables link fields and allows the item to render as an `<a>`. |
| `LinkUrl` | url/string | empty | Only when `WithLink` is `true` | Yes, when link is active | Destination URL. |
| `LinkTarget` | enum string | `_self` | Only when `WithLink` is `true` | Yes, when link is active | Options are `_self` and `_blank`; UI labels are `Current Tab` and `New Tab`. |
| `AriaLabel` | string | empty | Always visible | Yes | Optional accessible label for the item or link. Useful for logo-only and linked items. |

### Conditional Visibility Rules

| Selection | Visible fields |
|---|---|
| `ItemType = text-icon` | `Text`, `IconClass`, `WithLink`, `AriaLabel`, plus link fields when `WithLink = true`. |
| `ItemType = logo-image` | `LogoImage`, `WithLink`, `AriaLabel`, plus link fields when `WithLink = true`. |
| `WithLink = false` | `LinkUrl` and `LinkTarget` are hidden. The item renders as a `<span>`. |
| `WithLink = true` | `LinkUrl` and `LinkTarget` are visible. The item renders as an `<a>` only when `LinkUrl` is not empty. |

### Legacy Compatibility

The Razor renderer preserves older saved content that may not have the newer fields:

| Missing field | Fallback behavior |
|---|---|
| `ItemType` | Defaults to text + icon unless the item has a `LogoImage` and has neither `Text` nor `IconClass`. In that logo-only case, it renders as a logo image item. |
| `WithLink` | If `LinkUrl` exists and `WithLink` is missing/empty, the item still links. If `WithLink` is present, it must be `true` for the link to render. |
| Invalid `LinkTarget` | Falls back to `_self`. |

Empty items are skipped. A logo image item without `LogoImage` renders nothing. A text + icon item without both `Text` and `IconClass` renders nothing.

## Template Settings Field Reference

### Visual Settings

| Field | Default | Allowed values | Rendered as |
|---|---|---|---|
| `BackgroundColor` | `#050505` | `#050505`, `#01233F`, `#ffffff`, `transparent` | CSS variable `--oc-ms-bg` |
| `TextColor` | `#f8fafc` | `#f8fafc`, `#ffffff`, `#d1d5db`, `#111827`, `#01233F` | CSS variable `--oc-ms-color` |
| `TextSize` | `medium` | `small`, `medium`, `large` | Root class `oc-ms-text-{value}` |
| `LogoHeight` | `32px` | `24px`, `32px`, `40px`, `56px` | CSS variable `--oc-ms-logo-height` |
| `ItemGap` | `3rem` | `2rem`, `3rem`, `4rem`, `5rem` | CSS variable `--oc-ms-gap` |
| `SectionPaddingY` | `1rem` | `0.75rem`, `1rem`, `1.5rem`, `2rem` | CSS variable `--oc-ms-padding-y` |

### Motion Settings

| Field | Default | Allowed values | Behavior |
|---|---|---|---|
| `MarqueeSpeed` | `45s` | `20s`, `30s`, `45s`, `60s`, `90s` | Sets `--oc-ms-duration`. Lower values move faster; higher values move slower. |
| `Direction` | `left` | `left`, `right` | Adds `oc-ms-direction-left` or `oc-ms-direction-right`; right changes the animation keyframe name. |
| `PauseOnHover` | `true` | boolean | Adds `oc-ms-pause-on-hover`, pausing animation on hover and focus within. |
| `FadeEdges` | `true` | boolean | Adds `oc-ms-fade-edges`, applying a left/right mask fade to the viewport. |

### Layout Utility Settings

| Field | Default | Allowed values | Behavior |
|---|---|---|---|
| `MarginTop` | `mt-auto` | `mt-0`, `mt-1`, `mt-2`, `mt-3`, `mt-4`, `mt-5`, `mt-auto` | Appended to the root section class when not empty. |
| `MarginBottom` | `mb-auto` | `mb-0`, `mb-1`, `mb-2`, `mb-3`, `mb-4`, `mb-5`, `mb-auto` | Appended to the root section class when not empty. |
| `PaddingTop` | `pt-auto` | `pt-0`, `pt-1`, `pt-2`, `pt-3`, `pt-4`, `pt-5`, `pt-auto` | Appended to the root section class when not empty. |
| `PaddingBottom` | `pb-auto` | `pb-0`, `pb-1`, `pb-2`, `pb-3`, `pb-4`, `pb-5`, `pb-auto` | Appended to the root section class when not empty. |

## Rendering Behavior

### Markup Structure

When `Items` contains at least one item, Razor renders this structure:

```html
<section id="oc-marquee-section-{ModuleId}" class="oc-marquee-section ..." aria-label="{ModuleTitle}" style="--oc-ms-bg:...;">
  <div class="oc-ms-viewport">
    <div class="oc-ms-track">
      <div class="oc-ms-group">...</div>
      <div class="oc-ms-group" aria-hidden="true">...</div>
      ...
    </div>
  </div>
</section>
```

If `ModuleAnchor` is present, Razor renders a separate anchor `<div id="{ModuleAnchor}"></div>` before the section.

### Root and Child CSS Classes

| Class | Purpose |
|---|---|
| `oc-marquee-section` | Root component class. Owns default CSS variables, background, color, overflow, and section padding. |
| `oc-ms-text-small` | Small text/icon size. |
| `oc-ms-text-medium` | Medium text/icon size. |
| `oc-ms-text-large` | Large text/icon size. |
| `oc-ms-direction-left` | Left-moving marquee. Added by Razor for left direction. |
| `oc-ms-direction-right` | Right-moving marquee. Switches track animation to `oc-ms-marquee-right`. |
| `oc-ms-pause-on-hover` | Enables animation pause on hover and focus within. |
| `oc-ms-fade-edges` | Enables viewport mask fade at the left and right edges. |
| `oc-ms-viewport` | Overflow container and fade mask target. |
| `oc-ms-track` | Flex row that animates horizontally. |
| `oc-ms-group` | One repeated group of rendered items. Clone groups after the first are `aria-hidden="true"`. |
| `oc-ms-item` | Base item class for links and spans. |
| `oc-ms-item-link` | Added when an item renders as an `<a>`. |
| `oc-ms-icon` | Icon font element for text + icon items. |
| `oc-ms-text` | Text span for text + icon items. |
| `oc-ms-logo` | Logo image element for logo image items. |

### CSS Variables

| Variable | Default | Source |
|---|---|---|
| `--oc-ms-bg` | `#050505` | `BackgroundColor` |
| `--oc-ms-color` | `#f8fafc` | `TextColor` |
| `--oc-ms-logo-height` | `32px` | `LogoHeight` |
| `--oc-ms-gap` | `3rem` | `ItemGap` |
| `--oc-ms-padding-y` | `1rem` | `SectionPaddingY` |
| `--oc-ms-duration` | `45s` | `MarqueeSpeed` |
| `--oc-ms-loop-shift` | `-12.5%` | Hard-coded in Razor to match eight rendered groups. |

On screens up to `767px`, CSS clamps the effective gap to `min(var(--oc-ms-gap), 2rem)` and reduces large text to `1.2rem`.

### Animation

The track uses `animation: oc-ms-marquee-left var(--oc-ms-duration) linear infinite` by default.

| Direction | Root class | Keyframes | Movement |
|---|---|---|---|
| `left` | `oc-ms-direction-left` | `oc-ms-marquee-left` | From `translate3d(0, 0, 0)` to `translate3d(var(--oc-ms-loop-shift), 0, 0)`. |
| `right` | `oc-ms-direction-right` | `oc-ms-marquee-right` | From `translate3d(var(--oc-ms-loop-shift), 0, 0)` to `translate3d(0, 0, 0)`. |

Razor renders eight total groups: one primary group plus seven cloned groups. The clones make the loop appear continuous. Cloned groups are marked `aria-hidden="true"` and cloned links receive `tabindex="-1"` so keyboard focus stays on the primary item set.

### Reduced Motion

For visitors with `prefers-reduced-motion: reduce`:

- The viewport becomes horizontally scrollable with `overflow-x: auto`.
- Fade masks are removed.
- Track animation is disabled.
- Cloned groups are hidden.

### Hover and Focus Pause

When `PauseOnHover` is enabled, the root receives `oc-ms-pause-on-hover`. CSS pauses the track animation when the section is hovered or when a child link receives focus:

```css
.oc-marquee-section.oc-ms-pause-on-hover:hover .oc-ms-track,
.oc-marquee-section.oc-ms-pause-on-hover:focus-within .oc-ms-track {
    animation-play-state: paused;
}
```

### Links and Safety

An item renders as a link only when it has a non-empty `LinkUrl` and link behavior is enabled by either:

- `WithLink = true`, or
- legacy content where `WithLink` is missing/empty.

When `LinkTarget` is `_blank`, Razor adds:

```html
target="_blank" rel="noopener noreferrer"
```

This prevents the new page from gaining access to the originating window.

### Decorative Icons and Logos

Icon font elements render with `aria-hidden="true"` because the visible text or `AriaLabel` should carry the accessible meaning.

Logo images use `AriaLabel` as the image `alt` text when no item text exists. Since logo image items normally do not render item text, add `AriaLabel` for meaningful logo-only items, especially linked logos.

## Usage Recipes

### Text + Icon Marquee Without Links

Use this for capability or service highlights.

| Field | Example |
|---|---|
| `ItemType` | `text-icon` |
| `Text` | `Strategy` |
| `IconClass` | `fas fa-compass` |
| `WithLink` | `false` |
| `AriaLabel` | empty, unless the visible text needs extra context |

Recommended settings:

- `TextSize`: `medium`
- `MarqueeSpeed`: `45s`
- `PauseOnHover`: `true`
- `FadeEdges`: `true`

### Logo Image Marquee

Use this for partner, client, certification, or platform logo strips.

| Field | Example |
|---|---|
| `ItemType` | `logo-image` |
| `LogoImage` | image selected from `Content/Logos/` |
| `WithLink` | `false` unless the logo should navigate |
| `AriaLabel` | `Acme partner logo` or a clearer brand label |

Recommended settings:

- `LogoHeight`: `32px` or `40px`
- `ItemGap`: `4rem` for fewer, wider logos
- `TextColor`: not visually relevant to logo colors, but still inherited by link focus outlines

### Linked Marquee Items

Use links when each item has a meaningful destination.

| Field | Example |
|---|---|
| `WithLink` | `true` |
| `LinkUrl` | `/services/strategy` |
| `LinkTarget` | `_self` for internal pages, `_blank` for external destinations |
| `AriaLabel` | `Learn more about Strategy` |

For logo-only links, `AriaLabel` is important because the visible asset may not provide enough accessible context.

### Slow, Fast, or Direction Change

| Goal | Setting |
|---|---|
| Faster movement | Set `MarqueeSpeed` to `20s` or `30s`. |
| Default movement | Set `MarqueeSpeed` to `45s`. |
| Slower movement | Set `MarqueeSpeed` to `60s` or `90s`. |
| Reverse movement | Set `Direction` to `right`. |

## Asset Guidance

### Logo Images

- Prefer SVG for crisp brand marks when the site and DNN configuration allow it.
- Use transparent PNG when SVG is not appropriate.
- Keep logo files visually balanced before upload; the template constrains height but does not normalize internal whitespace.
- The rendered logo has `height: var(--oc-ms-logo-height)`, `width: auto`, `max-width: 180px`, and `object-fit: contain`.
- Use the `Content/Logos/` folder configured in `options.json` for easier editor discovery.
- If WebP assets are used, DNN may need WebP allowed globally before upload and serving work correctly.

### Icon Classes

- `IconClass` expects classes from an icon font already loaded by the active theme.
- Example: `fas fa-bolt`.
- If the icon font is not loaded globally, the `<i>` element renders but no icon appears.

## Accessibility Notes

- Set `ModuleTitle` so the `<section>` has a useful `aria-label`.
- Use `AriaLabel` for logo-only items, linked items, or any item where the visible content is not enough for assistive technology.
- Cloned marquee groups are rendered with `aria-hidden="true"`, so screen readers do not hear repeated content.
- Cloned links receive `tabindex="-1"`, so keyboard users do not tab through duplicate links.
- Icons render with `aria-hidden="true"`; do not rely on the icon alone to communicate meaning.
- Reduced motion users get a non-animated horizontal scroll area with clones hidden.
- When links open in a new tab, the template adds `rel="noopener noreferrer"` for safety.
- For linked logos, write `AriaLabel` as an action or destination, for example `Visit Acme partner site`, not only `Acme logo`.

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Text fields do not appear | `ItemType` is set to `Logo Image`. | Change `Item Type` to `Text + Icon`. |
| Logo field does not appear | `ItemType` is set to `Text + Icon`. | Change `Item Type` to `Logo Image`. |
| Link fields do not appear | `WithLink` is unchecked. | Check `With Link`. |
| Accordion header only says `Item` | `ItemLabel` has not been edited. | Set `Item Label` to a useful editor-only label. |
| Animation is not moving | Browser or OS has reduced motion enabled, CSS did not refresh, or the template CSS is cached. | Test without reduced motion, clear DNN/client cache, and confirm `template.css` is loaded. |
| Logo does not show | Missing file, wrong file path, unsupported extension, or upload restriction. | Re-select the image from `Content/Logos/`; verify DNN allows the file extension. |
| WebP logo does not upload or serve | DNN may not allow WebP globally. | Enable WebP in the DNN file extension/security settings if the site intends to use WebP. |
| Styles look stale after a rename or CSS change | DNN/client CSS cache is serving an older asset. | Clear DNN cache, browser cache, and any CDN cache used by the site. |
| External link opens without expected behavior | `LinkTarget` is not `_blank` or `WithLink` is unchecked. | Enable `With Link`, set `Link URL`, and choose `New Tab` when needed. |

## Manual QA Checklist

- [ ] Add the template to a page through an OpenContent module.
- [ ] Confirm no admin border appears around the module on the page.
- [ ] Confirm the section renders only when `Items` has at least one renderable item.
- [ ] Confirm `ModuleTitle` appears as the section `aria-label` when populated.
- [ ] Confirm `ModuleAnchor` renders a matching anchor `<div>` when populated.
- [ ] Add a text + icon item and verify `.oc-ms-icon` and `.oc-ms-text` render correctly.
- [ ] Add a logo image item and verify `.oc-ms-logo` uses the selected asset.
- [ ] Verify `ItemLabel` changes the accordion header but does not render publicly.
- [ ] Enable `WithLink` and verify the item renders as `.oc-ms-item.oc-ms-item-link`.
- [ ] Set `LinkTarget` to `_blank` and verify `rel="noopener noreferrer"` is present.
- [ ] Confirm cloned groups have `aria-hidden="true"`.
- [ ] Confirm cloned links are not keyboard-focusable.
- [ ] Test `Direction = left` and `Direction = right`.
- [ ] Test `MarqueeSpeed` values and confirm lower durations move faster.
- [ ] Verify hover and keyboard focus pause the marquee when `PauseOnHover` is enabled.
- [ ] Disable `PauseOnHover` and confirm hover/focus no longer pauses the track.
- [ ] Toggle `FadeEdges` and confirm the left/right mask appears or disappears.
- [ ] Test reduced motion and confirm animation stops, clones hide, and horizontal scrolling remains available.
- [ ] Test mobile width and confirm spacing/text remain usable.
- [ ] Clear DNN/client cache after CSS or template changes and re-test.

