---
name: Horizon Ethos
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#00668a'
  on-secondary: '#ffffff'
  secondary-container: '#40c2fd'
  on-secondary-container: '#004d6a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#301400'
  on-tertiary-container: '#c96b14'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#713700'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
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
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system is built for the modern explorer, focusing on clarity, inspiration, and seamless utility. It adopts a **Corporate / Modern** aesthetic with a lean toward **Minimalism**, ensuring that user-generated travel content and photography remain the focal point. 

The emotional response should be one of confidence and excitement—removing the cognitive load of travel planning through high-contrast legibility, generous whitespace, and a structured hierarchy. The interface utilizes subtle depth and high-quality typography to establish a premium, trustworthy feel.

## Colors
This design system utilizes a high-contrast palette to drive action and hierarchy:

- **Adventure Blue (#0F172A):** The primary foundation. Used for navigation, headings, and high-emphasis surfaces to provide a sense of stability and authority.
- **Horizon Sky (#38BDF8):** The secondary brand color. Used for progress indicators, selection states, and supporting icons to evoke the clarity of open skies.
- **Sunset Orange (#FB923C):** The tertiary accent. Reserved strictly for primary Calls to Action (CTAs), price highlights, and urgent notifications to ensure high visibility.
- **Surface & Backgrounds:** The neutral palette relies on Slate and Gray scales (from `#F8FAFC` to `#1E293B`) to define boundaries without heavy lines.

## Typography
The typography strategy pairs the geometric strength of **Montserrat** for display and headings with the utilitarian precision of **Inter** for UI elements and long-form body text.

- **Headings:** Use Montserrat to convey energy and modernity. Tracking should be tightened slightly on larger display sizes to maintain a cohesive visual block.
- **Body & UI:** Inter is used for its exceptional legibility at small sizes. Use `label-caps` for section headers above form groups or small metadata labels to create clear visual separation.
- **Hierarchy:** Maintain a clear contrast between `display-lg` and `body-md` to help users scan itineraries quickly.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum content width of 1440px. 

- **Grid:** Use a 12-column grid for desktop with 24px gutters. For mobile, transition to a 4-column grid with 16px margins.
- **Rhythm:** All spacing must be a multiple of the 4px base unit. 
- **Vertical Rhythm:** Use `lg` (48px) spacing between major sections and `md` (24px) spacing between related content cards within a section. 
- **Containment:** For travel planning dashboards, use "Content-First" layouts where the sidebar (320px) is fixed and the main itinerary view fluidly fills the remaining viewport.

## Elevation & Depth
The design system uses **Tonal Layers** and **Ambient Shadows** to define hierarchy. In a travel context, map elements and itinerary cards need to feel "lifted" above the canvas.

- **Level 0 (Base):** Neutral-50 (#F8FAFC) background.
- **Level 1 (Cards):** White (#FFFFFF) surface with a subtle 1px border (#E2E8F0) and no shadow. Used for list items.
- **Level 2 (Hover/Active):** White surface with a soft, diffused shadow: `0px 10px 15px -3px rgba(15, 23, 42, 0.08)`. Used for interactive itinerary cards.
- **Level 3 (Modals/Overlays):** White surface with a deep shadow: `0px 20px 25px -5px rgba(15, 23, 42, 0.12)`.

## Shapes
The shape language is **Rounded**, reflecting a friendly and modern travel experience. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) corner radius.
- **Large Containers:** Content sections and main itinerary cards use `rounded-lg` (1rem / 16px).
- **Interactive UI:** Small toggles and chips use `rounded-xl` (1.5rem / 24px) to appear more tactile and approachable.

## Components
- **Buttons:**
    - *Primary:* Sunset Orange background, white text. Bold weight. Used for "Book Now" or "Create Trip."
    - *Secondary:* Adventure Blue outline with Adventure Blue text. Used for "Edit" or "Save to Drafts."
    - *Tertiary:* Ghost style (no background/border) with Horizon Sky text for low-priority actions.
- **Form Inputs:**
    - Use a 1px border (#CBD5E1) that transitions to Horizon Sky on focus. Labels should use `label-bold` and reside above the field.
- **Chips/Badges:**
    - Small, pill-shaped indicators for categories (e.g., "Flight," "Hotel," "Activity"). Use light tints of Adventure Blue with high-contrast text.
- **Itinerary Cards:**
    - Must feature a 16:9 aspect ratio image at the top with `rounded-lg` applied only to the top corners. Text padding inside cards should be 20px (`md` spacing variant).
- **Selection States:**
    - Active navigation items or selected dates in a calendar should use a subtle Horizon Sky background tint (10% opacity) with a solid 2px Horizon Sky indicator.