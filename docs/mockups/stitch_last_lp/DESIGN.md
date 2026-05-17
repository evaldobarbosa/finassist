---
name: Financial Mentorship
colors:
  surface: '#f8f9ff'
  surface-dim: '#d8dadf'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f9'
  surface-container: '#eceef3'
  surface-container-high: '#e6e8ed'
  surface-container-highest: '#e1e2e8'
  on-surface: '#191c20'
  on-surface-variant: '#3f493f'
  inverse-surface: '#2e3135'
  inverse-on-surface: '#eff0f6'
  outline: '#6f7a6e'
  outline-variant: '#bfcabb'
  surface-tint: '#056d2e'
  primary: '#00501f'
  on-primary: '#ffffff'
  primary-container: '#006b2c'
  on-primary-container: '#8ee99b'
  inverse-primary: '#80da8d'
  secondary: '#085ac0'
  on-secondary: '#ffffff'
  secondary-container: '#5b94fd'
  on-secondary-container: '#002c66'
  tertiary: '#00501f'
  on-tertiary: '#ffffff'
  tertiary-container: '#006b2c'
  on-tertiary-container: '#71ee8b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9cf7a7'
  primary-fixed-dim: '#80da8d'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005320'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7e'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#f8f9ff'
  on-background: '#191c20'
  surface-variant: '#e1e2e8'
  zapgrana-green: '#006b2c'
  growth-light: '#7ffc97'
  info-blue: '#0058be'
  expense-red: '#bb0112'
  whatsapp-green: '#25D366'
  warning-amber: '#f59e0b'
  surface-bg: '#f9f9ff'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-xl:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  financial-display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 1.5rem
  margin-mobile: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 2rem
  section-gap: 6rem
---

## Brand & Style

This design system embodies the concept of **Financial Mentorship**. It is built to bridge the gap between cold, algorithmic fintech and human-centric guidance. The brand personality is **Trusted, Expert, and Accessible**, moving away from "black-box" AI toward a "human-in-the-loop" experience.

### Design Movement: Corporate Modern x Humanized
The visual style follows a **Corporate Modern** foundation—reliable, balanced, and professional—but is softened with humanizing elements. It prioritizes clarity and reassurance through:
- **Human Touchpoints:** Strategic use of persona imagery (Doutor Equilíbrio) and conversational UI.
- **Financial Clarity:** Explicit color-coding for cash flow (Inflow vs. Outflow).
- **Modern Utility:** A clean, systematic approach inspired by high-end SaaS, utilizing generous whitespace and a "WhatsApp-First" functional hierarchy.

The UI should evoke a sense of **growth** (Greens) and **security** (Blues), ensuring users feel in control of their financial destiny without the typical anxiety associated with money management.

## Colors

The color palette is engineered for **financial legibility**. The primary driver is "Zapgrana Green," symbolizing trust and wealth accumulation.

### Color Logic
- **Primary (Zapgrana Green):** Reserved for core brand identity, primary CTAs, and "Income" states.
- **Secondary (Info Blue):** Used for educational content, installments, and neutral informational badges.
- **Tertiary (Growth Light):** Used for success states, accent highlights, and "Positive Balance" indicators.
- **Danger (Expense Red):** Strictly applied to outflows, negative balances, and critical errors to create an immediate psychological association with "spending."

### Surfaces
The system uses a **Cool Neutral** base (`#f9f9ff`). This slight blue tint prevents the UI from feeling sterile, providing a more "tech-forward" and sophisticated backdrop than pure gray.

## Typography

This design system uses **Inter** exclusively to ensure a clean, functional, and highly readable interface across all digital touchpoints.

### Hierarchy Rules
- **Display Levels:** Used for hero headlines and marketing impact. They feature tighter line heights and slight negative letter spacing to feel "locked" and authoritative.
- **Body Text:** Optimized for long-form reading with a relaxed 1.6 line height.
- **Financial Values:** Large, bold styling is applied to balances and prices to ensure they are the first thing a user sees on a dashboard.
- **Captions & Labels:** Use a medium weight (500) to maintain legibility even at smaller scales (12-14px).

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **single-column stack** for mobile. The rhythm is based on a **4px baseline**, ensuring mathematical harmony between components.

### Layout Principles
- **Grid:** Desktop utilizes a 1280px max-width container with 24px gutters.
- **Sectioning:** Vertical rhythm is aggressive, using large gaps (96px) between major landing page sections to prevent information overload.
- **WhatsApp Context:** Interaction areas (inputs and buttons) are sized generously to mimic the comfort of mobile messaging apps, prioritizing touch targets of at least 48px.
- **Dashboard Sidebar:** Fixed at 280px on desktop to provide a persistent "cockpit" feel for financial navigation.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Soft Ambient Shadows**. We avoid heavy borders in favor of depth-based separation.

### Surface Tiers
- **Level 0 (Surface):** The main application background (`#f9f9ff`).
- **Level 1 (Card):** White surfaces (`#ffffff`) with a `shadow-sm`. Used for standard content.
- **Level 2 (Interactive):** Cards that lift on hover or active dropdowns, using `shadow-md`.
- **Level 3 (Overlay):** Modals and notifications using `shadow-elevated` to create clear separation from the page.

### Shadow Character
Shadows are low-opacity and tinted with the neutral color (`rgba(20, 27, 43, 0.08)`) to keep them looking natural and integrated rather than "dirty" or gray.

## Shapes

The shape language is **friendly and modern**, utilizing generous rounding to reinforce the brand's approachability.

- **Components:** Standard buttons and inputs use `0.5rem` (8px).
- **Containers:** Feature cards and dashboard sections use `1rem` (16px) to feel substantial and "held."
- **Badges:** Financial status tags and "Popular" plan indicators use **Pill-shaped** (full) rounding to differentiate them from functional buttons.
- **Avatars:** Circular masks are used for persona imagery (Doutor Equilíbrio) to emphasize the human connection.

## Components

### Buttons
- **Primary:** Solid "Zapgrana Green" background with white text. High-contrast and impactful.
- **Secondary:** Outline style with 2px borders in "Info Blue" or solid blue for informative actions.
- **WhatsApp FAB:** Floating action button in brand-specific green (`#25D366`), always accessible.

### Cards (Financial)
- **Standard:** White background, 16px border-radius, subtle shadow.
- **Pro/Featured:** 2px solid "Zapgrana Green" border or subtle green-tinted background to denote "Popular" or "Active" plans.
- **Financial Status:** Internal padding of 24px with dedicated areas for "Inflow" (Green icon) and "Outflow" (Red icon).

### Input Fields
- **Default:** 1px border (`#c3c6cf`) with 8px rounding.
- **Focus:** 2px border in "Zapgrana Green" with a soft glow (3px ring).
- **Error:** 2px border in "Expense Red" for immediate correction feedback.

### Chips & Badges
- Used for status (e.g., "Paid", "Pending"). Backgrounds use the `50` or `100` tint of the respective functional color (e.g., Light Green background for "Success" text).