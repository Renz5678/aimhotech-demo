---
name: Forest Precision Health
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#424844'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ee'
  outline: '#727974'
  outline-variant: '#c1c8c3'
  surface-tint: '#486458'
  primary: '#07241a'
  on-primary: '#ffffff'
  primary-container: '#1e3a2f'
  on-primary-container: '#86a496'
  inverse-primary: '#aecebe'
  secondary: '#566342'
  on-secondary: '#ffffff'
  secondary-container: '#d9e8bf'
  on-secondary-container: '#5c6948'
  tertiary: '#1f201f'
  on-tertiary: '#ffffff'
  tertiary-container: '#343534'
  on-tertiary-container: '#9d9d9c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#caeada'
  primary-fixed-dim: '#aecebe'
  on-primary-fixed: '#032017'
  on-primary-fixed-variant: '#304c41'
  secondary-fixed: '#d9e8bf'
  secondary-fixed-dim: '#becca4'
  on-secondary-fixed: '#141f05'
  on-secondary-fixed-variant: '#3f4b2c'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#464746'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Figtree
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Figtree
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Figtree
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Figtree
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Figtree
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Figtree
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  technical-id:
    fontFamily: IBM Plex Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  edge_margin: 20px
  stack_gap: 16px
---

## Brand & Style
This design system is engineered for community health workers operating in diverse environments, ranging from clinical settings to outdoor field visits. The brand personality is **composed, reliable, and human-centric**, blending the precision of medical technology with a warm, organic aesthetic that fosters trust.

The visual style utilizes a **Modern-Tactile** approach. It leverages "high-fidelity" depth through soft ambient shadows and layered surfaces to create a clear interactive hierarchy. High contrast is prioritized to ensure readability in bright outdoor conditions, while the "Forest" inspired palette provides a calming psychological effect for both the worker and the patient.

## Colors
The palette is rooted in deep earth tones to maintain professional authority while appearing approachable.

- **Forest Green (Primary):** Used for primary actions, headers, and brand identification. It represents stability and growth.
- **Sage (Secondary):** Used for subtle accents, notches, and secondary backgrounds.
- **Soft Cream (Background):** The primary surface color, chosen to reduce eye strain and provide a warmer feel than pure clinical white.
- **Semantic Risk Colors:** These are high-contrast indicators. **Risk Low** (Green), **Risk Moderate** (Ochre), and **Risk Elevated** (Terracotta) follow a natural progression of urgency without relying on harsh "traffic light" neon shades.

## Typography
**Figtree** is the workhorse of the system, providing a friendly yet highly legible geometric sans-serif experience. It is used for all primary UI elements and patient data. 

**IBM Plex Mono** is reserved strictly for technical strings, such as Patient IDs, Record UUIDs, or sync timestamps, to differentiate machine-generated data from human-centric content.

For mobile-first readability:
- Headlines use a tighter letter-spacing to maintain impact.
- Body text maintains a generous line-height (1.5) to ensure high legibility during rapid scanning in the field.
- Contrast ratios for all typography must exceed 4.5:1 against their respective backgrounds.

## Layout & Spacing
The layout follows a **Mobile-First Fluid** model. While the content expands to fill the screen, it maintains a strict internal rhythm based on an 8px grid (with 4px increments for micro-adjustments).

- **Safe Zones:** A 20px horizontal margin is maintained on all mobile screens to prevent thumb-clutter.
- **Tap Targets:** Every interactive element (buttons, list items, checkboxes) must have a minimum height of 48px to accommodate one-handed operation and gloved use cases.
- **Vertical Rhythm:** Content is grouped into logical "cards" with 16px of vertical spacing (stack_gap) between them to provide clear visual separation of tasks.

## Elevation & Depth
Depth in this design system is used to signify "interactability" and "priority."

- **Surface Level (0):** The Soft Cream (#FAF9F7) base layer.
- **Raised Level (1):** White cards used for data containers. These feature a very soft, diffused shadow (Hex: #1E3A2F at 4% opacity, Y: 4, Blur: 12) to suggest they can be tapped or expanded.
- **Active Level (2):** Primary action buttons and active state cards. These use a slightly more pronounced shadow (8% opacity) to "lift" them closer to the user's thumb.
- **Navigation:** The bottom navigation bar is pinned with a subtle top-border blur or a soft drop shadow to separate it from the scrolling content.

## Shapes
The shape language is defined by **Softened Precision**. 

- **Containers:** Cards and primary buttons use a 16px (rounded-lg) corner radius, creating a friendly and modern feel.
- **App Icon:** A unique rounded-square (squircle) with a specific **Sage Notch** in the top-right corner, mirroring the physical branding of the medical hardware.
- **Indicators:** Small status dots and risk indicators are perfectly circular, contrasting against the rectangular logic of the rest of the UI.

## Components
### Buttons
- **Primary:** Forest Green background, White text, 16px radius, 56px height. Contains an icon + text for maximum clarity.
- **Secondary:** Transparent background with a Sage border or Soft Cream background with Forest Green text.

### Cards & Activity Lists
- **Recent Activity:** High-contrast list items with a 1px Sage-tinted divider. Each item features a semantic Risk Dot on the left to allow the health worker to triage at a glance.
- **Metric Cards:** Large, bold display numbers (Display-LG) paired with muted labels for quick dashboard reporting.

### Input Fields
- **Clinical Inputs:** White background with a 1px stroke that shifts to Forest Green on focus. Labels always remain visible (no floating labels that disappear) to maintain clinical accuracy.

### Chips & Badges
- **Status Badges:** Used for "Sync Status" or "Pending" counts. Pill-shaped with a Soft Cream background and an accent dot corresponding to the status color.