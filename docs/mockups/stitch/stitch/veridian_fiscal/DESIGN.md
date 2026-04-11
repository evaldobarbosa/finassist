# Design System Specification: The Financial Editorial

## 1. Overview & Creative North Star
Most financial applications feel like spreadsheets—rigid, cold, and transactional. This design system rejects that clinical approach in favor of **"The Digital Ledger: Editorial Edition."** 

Our Creative North Star is to treat personal finance with the prestige of a high-end business publication. We achieve this through "Organic Precision"—a blend of rigorous mathematical accuracy and a soft, breathable UI. By utilizing intentional asymmetry, overlapping depth, and high-contrast typography scales, we move away from "boxed-in" templates toward a fluid, premium experience that feels curated rather than just calculated.

---

## 2. Colors & Surface Philosophy

### The Tonal Palette
We leverage the Material Design convention to create a sophisticated, layered environment.
- **Primary (`#006b2c`):** Our "Growth Green." Used sparingly for high-impact actions and brand presence.
- **Secondary (`#0058be`):** The "Trust Blue." Used for investment data and secondary analytical paths.
- **Tertiary (`#bb0112`):** The "Alert Red." Reserved strictly for expenses and critical warnings.

### The "No-Line" Rule
**Borders are a design failure.** To maintain an editorial feel, designers are prohibited from using 1px solid borders to section content. Boundaries must be defined exclusively through background color shifts.
- **Surface Nesting:** Use `surface_container_low` for the page background, nesting `surface_container_lowest` (Pure White) for cards. This creates a natural "lift" without visual noise.
- **The Glass & Gradient Rule:** For floating elements (like Bottom Sheets or Navigation Bars), use a semi-transparent `surface` with a 20px backdrop-blur. 
- **Signature Textures:** Main CTA buttons should not be flat. Apply a subtle linear gradient from `primary` to `primary_container` (Top-Left to Bottom-Right) to provide a "tactile" glow that signifies premium quality.

---

## 3. Typography: The Narrative Voice
We use **Inter** not as a system font, but as a typesetting tool.

| Role | Scale | Weight | Intent |
| :--- | :--- | :--- | :--- |
| **Display-LG** | 3.5rem | 700 | Large balance displays; high-impact "hero" numbers. |
| **Headline-MD** | 1.75rem | 600 | Page headers; creating a clear entry point. |
| **Title-SM** | 1.0rem | 600 | Section headers within cards. |
| **Body-MD** | 0.875rem | 400 | Transaction details and general reading. |
| **Label-SM** | 0.6875rem | 500 | Micro-data: timestamps, tags, and metadata. |

**Editorial Contrast:** Always pair a `Display-LG` number with a `Label-SM` descriptor. This extreme variance in scale creates the "premium magazine" look, emphasizing data over decorative labels.

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows and borders create "clutter." We utilize **Tonal Layering** to define the Z-axis.

1.  **The Layering Principle:** 
    *   **Base:** `background` (#f9f9ff)
    *   **Sectioning:** `surface_container_low`
    *   **Interactive Cards:** `surface_container_lowest` (#ffffff)
2.  **Ambient Shadows:** If an element must float (e.g., a Modal), use a custom shadow: `0px 24px 48px -12px rgba(20, 27, 43, 0.08)`. The shadow is a tinted version of `on_surface`, never pure black.
3.  **The "Ghost Border" Fallback:** If accessibility requires a container edge (e.g., in high-contrast mode), use `outline_variant` at **15% opacity**. Never use 100% opaque lines.
4.  **Glassmorphism:** Use `surface` at 80% opacity with a background blur on the Global Navigation Bar to allow content to "bleed" through, creating an integrated, modern feel.

---

## 5. Components

### Buttons & Interaction
*   **Primary:** `primary` background, `on_primary` text. Use `xl` (1.5rem) radius for a modern, pill-like feel.
*   **Secondary:** No border. Use `surface_container_high` as the background with `on_surface` text. This feels more integrated than a boxed button.
*   **Ghost:** No background. Use `primary` text. Reserved for low-emphasis actions like "Cancel" or "Skip."

### Input Fields
*   **Structure:** 44px height. Use `surface_container_highest` for the background rather than a white box with a border.
*   **States:** On focus, the background shifts to `surface_container_lowest` and an `outline` of 2px `primary` appears.

### Cards & Lists (The Editorial Feed)
*   **Rule:** Forbid divider lines.
*   **Spacing:** Use `spacing-6` (1.5rem) to separate list items.
*   **Visual Separation:** Use `surface_container_low` for the "odd" items in a list or simply rely on the generous `body-md` line height (1.5) to create a natural rhythm.

### Financial Chips
*   **Income Badge:** `primary_fixed` background with `on_primary_fixed_variant` text.
*   **Expense Badge:** `tertiary_fixed` background with `on_tertiary_fixed_variant` text.
*   **Shape:** Always `full` (9999px) radius.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace White Space:** If you think there is enough space, add `8px` more. Luxury is defined by the space you don't use.
*   **Use Asymmetric Grids:** Align your primary data to the left, but allow secondary metadata to float to the far right to create a "spread" feel.
*   **Color as Information:** Only use `primary` (green) or `tertiary` (red) for actual financial movement. Never use them for decorative icons.

### Don't:
*   **Don't use 1px Dividers:** They cut the UI into "jail cells." Use background tonal shifts instead.
*   **Don't use standard Grey Shadows:** Use the `on_surface` tint to keep the depth feeling "warm."
*   **Don't Center-Align everything:** Center alignment is for greeting cards. Left-align for an authoritative, editorial structure.
*   **Don't use high-contrast borders on Inputs:** It makes the app feel like a legacy web form. Stick to the "Ghost Border" or tonal backgrounds.