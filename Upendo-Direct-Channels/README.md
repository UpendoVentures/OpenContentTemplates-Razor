# Upendo Direct Channels

Reusable OpenContent section for a contact and social information block. It includes a social follow area, contact rows, and normal hours.

## Content Fields

- `ModuleTitle`: Administrator-facing title only.
- `ModuleAnchor`: Optional safe page anchor. Letters, numbers, and hyphens only.
- `SectionAriaLabel`: Accessible label used when the contact heading is empty.
- `SocialHeadingLead`, `SocialHeadingText`: Social intro copy. The lead renders bold.
- `SocialLinks`: Dynamic social link list. Add, remove, and reorder social networks in display order.
- `SocialLinks[].Network`: Controls the network-specific hover and focus color class.
- `SocialLinks[].Icon`, `SocialLinks[].Label`, `SocialLinks[].Url`: Social icon class, visible label, and optional URL.
- `ContactHeadingLead`, `ContactHeadingEmphasis`, `ContactIntro`: Contact section heading and intro copy.
- `ContactItems`: Dynamic contact rows with `Icon`, `Label`, and `Value`.
- `HoursHeadingLead`, `HoursHeadingEmphasis`: Normal hours heading copy.
- `HourItems`: Dynamic hours rows with `Icon`, `Label`, and `Value`.

## Settings

- `ContainerWidth`
- `MarginTop`
- `MarginBottom`
- `PaddingTop`
- `PaddingBottom`
- `BackgroundColorClass`

Settings are intentionally minimal and default to a clean white/light section.

## Accessibility And Safety

- The section uses `aria-labelledby` when the contact heading is present, otherwise `SectionAriaLabel`.
- Font Awesome icon classes are sanitized to letters, numbers, hyphens, underscores, and spaces.
- Social network tokens are restricted to the supported network list or `custom`.
- URLs are sanitized to allow anchors, relative URLs, `http`, `https`, `mailto`, and `tel`.
- Editable text is HTML-encoded; line breaks are preserved safely where textarea fields are used.
- Icons are decorative and hidden from assistive technology.
