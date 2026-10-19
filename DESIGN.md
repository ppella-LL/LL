# LuggageLess — DESIGN.md

A travel-meets-fashion marketplace UI: **Airbnb's** warm, airy, photography-first
layout fused with **Nike's** bold editorial typography and dense retail chrome.
Brand colours stay **orange + black** (and their shades) — orange is the single
"voltage" reserved for the primary action, price, and accents.

## 1. Visual theme & atmosphere
- Clean, generous canvas with lots of whitespace (Airbnb).
- Full-bleed photographic heroes with **huge UPPERCASE display type** burned over
  them, tight letter-spacing (Nike).
- Soft, rounded product/trip cards (Airbnb) over a tight 8px grid (Nike).
- Colour is restrained: black/white/gray chrome; **orange only** for CTA, price,
  active state, accents. Never decorative orange everywhere.

## 2. Colour palette & roles (our brand)
- `brand` #ff6600 — primary action, price, active indicator, rating/accent dot.
- `brand-dark` #e65c00 — hover/pressed.
- `ink` #0a0a0c (near-black) — strong blocks, secondary CTA, nav, hero overlays.
- surfaces: white / near-black in dark mode (existing token system).
- text: content / content-soft / content-faint (existing tokens).
- Semantic: success green, error red — only for status, never chrome.

## 3. Typography rules
- Display (hero): **UPPERCASE, weight 800–900, tracking tight (-0.02em to -0.04em)**,
  very large (clamp ~2.5rem → 5rem). Nike-style lockups.
- Section titles: weight 700, normal case, moderate size.
- Body / UI: weight 400–600 (Airbnb's modest weights — avoid everything-black).
- Price & numeric: weight 800, orange.
- Eyebrows/labels: 11px, uppercase, tracking wide, content-faint.

## 4. Components
- **Primary CTA**: black (`ink`) or orange pill, full-rounded, bold, generous padding.
  Orange = the one hero action; black = secondary strong action.
- **Cards**: radius ~16–20px, soft shadow, image-forward, minimal border.
- **Pills / filters / search**: fully rounded, gray idle, black/orange active.
- **Chips/badges**: small, uppercase, tracking wide.
- Keep all existing buttons, handlers and logic unchanged — restyle only.

## 5. Layout
- Spacing scale on 4/8px grid; section gaps ~48px.
- Max content width generous on desktop (`max-w-6xl`), single column on mobile.
- Product grids: 2 cols mobile → up to 5–6 cols desktop, tight gaps.
- Heroes span full width, photo + overlay + oversized headline bottom-left.

## 6. Depth
- Soft, diffuse shadows (not heavy). Elevation via subtle shadow + surface step.

## 7. Do / Don't
- DO lead with photography and oversized type.
- DO keep orange rare and intentional.
- DON'T make every text weight 900 — vary weights (Airbnb).
- DON'T add new colours beyond orange/black/neutral + status.
