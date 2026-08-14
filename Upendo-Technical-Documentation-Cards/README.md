# Upendo Technical Documentation Cards

Reusable OpenContent template for a technical documentation section with an accessible heading, optional intro text, interactive grid/list controls, and responsive documentation cards.

## Files

| File | Purpose |
|---|---|
| `template.cshtml` | Razor rendering logic, safe dynamic helpers, allow-listed settings, sanitized icons, source-aware document URLs, computed upload sizes, safe URLs, accessible section semantics, and scoped view-toggle script. |
| `template.css` | Scoped styles for `.oc-technical-docs` and `.oc-tdc-*`, responsive card grid, card states, toggle controls, CTA focus styles, and reduced-motion handling. |
| `schema.json` | Content Edit schema for admin fields and the `Documents` accordion. |
| `options.json` | Content Edit editor widgets, helper text, placeholders, and labels. |
| `data.json` | Default sample content. |
| `template-schema.json` | Template Settings schema for layout, spacing, background, card styling, and icon styling. |
| `template-options.json` | Template Settings editor widgets and helper text. |
| `template-data.json` | Default Template Settings values. |
| `README.md` | Maintainer and editor documentation. |

## Content Fields

| Field | Purpose |
|---|---|
| `ModuleTitle` | Administrator-facing title and fallback accessibility label. |
| `ModuleAnchor` | Optional section `id`. Only letters, numbers, and hyphens are rendered. |
| `SectionHeading` | Optional visible heading. HTML is allowed. |
| `SectionHeadingElement` | Heading level: `h2`, `h3`, or `h4`. |
| `IntroText` | Optional intro copy below the heading. HTML is allowed. |
| `SectionAriaLabel` | Used only when no visible heading exists. |
| `Documents` | Accordion array of documentation cards. |

Each document is organized in the editor as basic content (`Title`, `Description`), source selection (`FileSource`, `Url`, `UploadFile`), file display fallbacks (`FileTypeLabel`, URL-only `FileMeta`), icon, and footer/CTA fields (`FooterLabel`, `CtaText`, `LinkTarget`, `CtaAriaLabel`).

## Document Sources

Use `FileSource` to choose how a card resolves its CTA link.

| Source | Editor Fields | Size Display |
|---|---|---|
| `url` | Use `Url` for anchors, slash-relative URLs, `http`, `https`, `mailto`, or `tel`. Manual `FileTypeLabel` and legacy `FileMeta` fallbacks are shown only in this mode. | The template derives the type label from the URL extension when available. It cannot inspect remote file size, so it keeps the size portion of legacy `FileMeta` when present; otherwise it displays `0 MB`. |
| `upload` | Use `UploadFile` to select or upload a real file. Manual `FileMeta` is hidden in this mode. | The template derives the type label from the uploaded file URL extension, such as `PDF`, `DOC`, `DOCX`, or `WEBP`. It tries common OpenContent file metadata properties such as `Size`, `FileSize`, `Length`, `ContentLength`, and `Bytes`, then common numeric file ID properties such as `FileId`, `FileID`, `Id`, `ID`, and `fileId` through DNN FileManager. If metadata is unavailable, it maps same-site upload URLs/paths to the local website or portal file system and reads the file length when possible. If no local file can be found, it displays `0 MB`. |

`FileTypeLabel` is visible only in URL mode as an optional fallback. The template first uses the resolved safe URL extension. If no extension can be derived, it falls back to `FileTypeLabel`, then to the type portion of legacy `FileMeta`. Upload mode derives the type label from the uploaded file URL extension and does not expose a manual fallback in the editor.

## Template Settings

| Setting | Default | Notes |
|---|---|---|
| `BackgroundColorClass` | `bg-light` | Allow-listed Bootstrap/site background class. |
| `CardCorners` | `soft` | `square` or `soft`. |
| `CardsPerRow` | `3` | Desktop column count. Tablet caps at two columns. Mobile is one column. |
| `CardStyle` | `flat` | `flat`, `outlined`, or `elevated`. |
| `ContainerWidth` | `container-xxl` | Allow-listed Bootstrap container class. |
| `DefaultView` | `grid` | Initial grid or list layout. The visible grid/list toggle always renders as interactive buttons with `aria-pressed` and switches scoped CSS classes. |
| `IconColor` | `primary` | `primary`, `muted`, or `dark`. |
| `MarginBottom`, `MarginTop`, `PaddingBottom`, `PaddingTop` | spacing utilities | Allow-listed Bootstrap spacing classes. |

## Accessibility And Safety

The template renders a semantic `<section>`. When `SectionHeading` exists, the section uses `aria-labelledby`; otherwise it uses `SectionAriaLabel`, then `ModuleTitle`, then `Technical documentation`.

Documents render as a native `<ul>` with `<li>` items. Font Awesome icons are decorative and sanitized before rendering. CTAs render only when both `CtaText` and the selected source resolve to a safe URL. `_blank` links receive `rel="noopener noreferrer"`.

Safe URLs include anchors, slash-relative URLs, `http`, `https`, `mailto`, and literal `tel` schemes. Unsupported schemes are blocked. File-size lookup does not make external network requests; absolute URLs are only considered for local file lookup when their host matches the current website.

## Editor Notes

The grid/list toggle is always interactive. `DefaultView` only controls the initial layout before a visitor changes it.

Template Settings are kept alphabetically by field name for easier scanning in OpenContent.
