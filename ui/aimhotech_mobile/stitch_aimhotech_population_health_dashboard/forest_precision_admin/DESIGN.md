---
name: Forest Precision Admin
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
  tertiary: '#331716'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c2c2a'
  on-tertiary-container: '#c0928f'
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
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ecbbb7'
  on-tertiary-fixed: '#2f1412'
  on-tertiary-fixed-variant: '#603e3b'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.4'
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-lg:
    fontFamily: IBM Plex Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.1'
  data-sm:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar_width: 228px
  base_unit: 4px
  container_padding: 32px
  card_gap: 24px
  section_margin: 40px
  gutter: 16px
---

## Brand & Style
The design system is engineered for high-stakes healthcare administration, balancing clinical precision with a calming, organic aesthetic. It targets medical professionals and health administrators who require data-dense environments that do not induce fatigue.

The visual style is **Modern Corporate** with a **Tactile** twist. It utilizes a palette inspired by nature—forest greens and creams—to reduce the sterile feel of traditional medical software. The interface relies on a "Layered Surface" philosophy where depth is communicated through soft, multi-layered shadows and subtle tonal shifts rather than heavy borders. The overall mood is authoritative, dependable, and meticulously organized.

## Colors
The color palette is grounded in a deep **Forest Green** (Primary), used primarily for structural navigation to provide a strong visual anchor. The **Soft Cream** background replaces pure white to reduce eye strain during long-form data review.

A functional **Risk Scale** is integrated into the core palette to provide immediate semantic meaning to health data:
- **Low:** Deep sage green, signaling stability.
- **Moderate:** Ochre/Gold, signaling a need for observation.
- **Elevated:** Muted brick red, signaling urgent intervention.

Secondary elements and non-critical data visualizations utilize **Sage**, bridging the gap between the dark primary and light background.

## Typography
This design system employs a dual-font strategy. **IBM Plex Sans** is the workhorse for all UI controls, headers, and descriptive text, offering excellent legibility and a professional tone. 

**IBM Plex Mono** is reserved strictly for quantitative data, timestamps, and ID strings. This monospaced choice ensures that columns of numbers align perfectly in tables and dashboards, facilitating rapid scanning and comparison of clinical metrics. 

Mobile adjustments: `display-lg` should scale down to 24px (`headline-md`) on devices smaller than 768px.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid model**. A permanent 228px sidebar resides on the left, while the main content area utilizes a fluid grid with generous horizontal padding (32px) to maintain a premium, "breathable" feel.

The spacing rhythm is based on a **4px baseline grid**. 
- **Desktop:** 12-column grid, 24px gutters.
- **Tablet (1024px):** 8-column grid, 16px gutters, sidebar collapses to an icon rail.
- **Mobile (480px):** 4-column grid, 16px margins, sidebar becomes a hidden drawer.

Data-heavy cards should use `container_padding` for internal white space to prevent visual clutter.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Soft Ambient Shadows**. 

1.  **Level 0 (Base):** Soft Cream background.
2.  **Level 1 (Cards/Containers):** Pure White surface with a very soft, diffused shadow (Offset: 0px 4px, Blur: 20px, Color: rgba(30, 58, 47, 0.05)).
3.  **Level 2 (Dropdowns/Modals):** Pure White surface with a more defined shadow (Offset: 0px 8px, Blur: 32px, Color: rgba(30, 58, 47, 0.12)).

Avoid using borders for containment; use the subtle contrast between White cards and the Soft Cream background to define boundaries.

## Shapes
The design system uses a **Rounded** shape language to maintain its approachable, modern character. 
- **Standard UI (Buttons, Inputs):** 8px (0.5rem) corner radius.
- **Large Containers (Cards, Dashboards):** 16px (1rem) corner radius.
- **Tags/Badges:** Pill-shaped (fully rounded) to contrast against the more structural card shapes.

## Components
### Sidebar & Navigation
The sidebar is #1E3A2F (Forest Green). Active states must use a semi-transparent white background (opacity 10%) and a 4px wide Sage (#A3B18B) vertical accent bar on the far left of the item.

### Buttons
- **Primary:** Forest Green background with White text.
- **Secondary:** Sage background with Forest Green text.
- **Ghost:** No background, Forest Green text, 8px rounded corners.

### Input Fields
Inputs use a white background with a 1px border in #E5E5E0. On focus, the border transitions to Sage with a 2px soft outer glow in the same color.

### Data Cards
Cards are the primary unit of the dashboard. They should feature a `label-caps` title in `neutral_text_muted` and large `data-lg` metrics for primary KPIs.

### Status Chips
Status indicators (Low, Moderate, Elevated) use a light tinted background of their respective risk color (15% opacity) and full-strength color for the text and a small leading dot.