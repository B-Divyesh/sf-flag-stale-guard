# Flag Stale Guard — visual system

## Direction: botanical field guide

Flag cleanup is an inspection practice. The interface treats each configured flag as a pressed plant specimen: labelled, dated, and placed in a clear status tray. This gives maintainers a calm way to inspect risk without borrowing the look of a delivery dashboard.

## Palette

- **Paper** `#F4F0E4` — warm herbarium paper, page background.
- **Ink** `#1F302A` — body text and outlines.
- **Moss** `#315E45` — primary action and healthy metadata.
- **Lichen** `#DCE1C4` — quiet surfaces.
- **Ochre** `#B36F22` — expiring-soon marker.
- **Berry** `#8B3038` — expired or removal-blocked marker.
- **Night paper** `#17231F` — dark treatment background.

All body text uses Ink on Paper or Paper on Night paper. Status is always paired with a word and icon, never color alone.

## Type and spacing

The display face is a self-hosted local `Georgia`-style serif stack for field-guide headings. The utilitarian body face is the self-hosted system UI stack. This avoids remote font calls while keeping code samples crisp. Spacing follows an 8px scale, with generous 32–72px section intervals and a 68-character reading measure.

## Shape and interaction

Thin ink rules, rounded specimen labels, botanical line marks, and slightly offset "paper slips" replace generic cards. Buttons are square-shouldered labels with a 2px ink edge. On hover, specimen labels lift by 2px; focus is a high-contrast ochre outline. The main illustration has a single gentle leaf sway only when motion is allowed; reduced-motion users see the finished composition.

## Asset plan and provenance

`public/field-guide-hero.webp` is an original generated editorial illustration. It shows a pressed herbarium sheet with three tagged leaves, one dried and marked for removal, beside an engineer's pencil and small code-reference dots. It contains no readable text, logos, or third-party material. Generated with `/opt/fleet/lib/gen-image.sh`, deployment `factory-image`, then resized/optimized locally to WebP. The prompt is saved beside the asset as `public/field-guide-hero.png.json`.

`public/field-guide-social.webp` is a deterministic center crop of the same original artwork at 1200×630 for social cards. No new generated or third-party material was added.
