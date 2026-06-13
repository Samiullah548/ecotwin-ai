---
name: EcoTwin AI
colors:
  surface: '#0c1513'
  surface-dim: '#0c1513'
  surface-bright: '#323b39'
  surface-container-lowest: '#07100e'
  surface-container-low: '#141d1b'
  surface-container: '#18211f'
  surface-container-high: '#232c29'
  surface-container-highest: '#2d3734'
  on-surface: '#dbe5e1'
  on-surface-variant: '#c1c8c4'
  inverse-surface: '#dbe5e1'
  inverse-on-surface: '#293230'
  outline: '#8c928f'
  outline-variant: '#424845'
  surface-tint: '#b0cdc2'
  primary: '#b0cdc2'
  on-primary: '#1c352e'
  primary-container: '#0f2922'
  on-primary-container: '#769188'
  inverse-primary: '#4a645b'
  secondary: '#d3fe32'
  on-secondary: '#293500'
  secondary-container: '#b8e100'
  on-secondary-container: '#4e6100'
  tertiary: '#afc6ff'
  on-tertiary: '#002d6d'
  tertiary-container: '#002255'
  on-tertiary-container: '#4787ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cce9de'
  primary-fixed-dim: '#b0cdc2'
  on-primary-fixed: '#052019'
  on-primary-fixed-variant: '#324c44'
  secondary-fixed: '#c8f323'
  secondary-fixed-dim: '#aed500'
  on-secondary-fixed: '#171e00'
  on-secondary-fixed-variant: '#3d4d00'
  tertiary-fixed: '#d9e2ff'
  tertiary-fixed-dim: '#afc6ff'
  on-tertiary-fixed: '#001944'
  on-tertiary-fixed-variant: '#004299'
  background: '#0c1513'
  on-background: '#dbe5e1'
  surface-variant: '#2d3734'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
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
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 20px
---

## Brand & Style
The design system for this product is rooted in a "Biophilic Futurism" aesthetic. It balances the high-tech precision of AI with the organic, grounded textures of the natural world. The goal is to evoke a sense of environmental stewardship through a premium, high-fidelity lens. 

The style utilizes **Glassmorphism** as its primary visual engine—representing transparency in data and sustainability—layered over deep, lush backdrops. The emotional response is one of calm authority, innovation, and "technological hope." Expect high-contrast typography, frosted glass surfaces, and vibrant glowing accents that signify active intelligence and life.

## Colors
The palette is centered around a sophisticated dark mode that mimics a deep forest canopy at twilight.

- **Primary (Deep Forest):** Used for base backgrounds and deep structural layers. It provides a rich, organic foundation.
- **Secondary (Vibrant Lime):** A high-visibility "energy" color used for primary actions, glowing indicators, and success states. It represents new growth and technological efficiency.
- **Tertiary (Oceanic Blue):** Used for data visualizations, info-states, and secondary accents to represent water and atmosphere.
- **Neutral:** A near-black charcoal with a hint of green tint, used for deep backgrounds to maintain color harmony.
- **Gradients:** Use "Lush Gradients" combining the Primary and Tertiary colors with low-opacity overlays to create depth within glass panels.

## Typography
The typography system relies on a high-contrast pairing: **Montserrat** for impactful headlines and **Inter** for utilitarian body and data roles. 

Headlines use generous tracking (letter spacing) in smaller roles but remain tight and bold for display roles. Body text is optimized for readability against dark backgrounds, utilizing slightly increased line height and a subtle weight (400) to prevent "haloing" on high-brightness screens. All labels should utilize uppercase styling when used for category headers to lean into the professional SaaS aesthetic.

## Layout & Spacing
The layout follows a **Fluid Grid** philosophy within a capped container. We utilize an 8px base unit to ensure consistent scaling.

- **Desktop (1440px+):** 12-column grid with 24px gutters. Use wide 64px margins to allow the glassmorphic panels "room to breathe."
- **Tablet (768px - 1439px):** 8-column grid with 20px gutters. 
- **Mobile (Under 768px):** 4-column grid. Margins compress to 20px. 

Padding within glass cards should be generous (typically 32px) to maintain the "premium" feel. Layouts should favor asymmetrical compositions to feel more organic and less rigid.

## Elevation & Depth
Elevation in this design system is achieved through **Backdrop Blurs** and **Luminous Outlines** rather than traditional drop shadows.

1.  **Level 0 (Base):** Deep neutral background with a subtle radial gradient of primary color in the corners.
2.  **Level 1 (Surface):** Glassmorphism with `backdrop-filter: blur(20px)`, a 10% white fill, and a 1px solid border at 15% opacity.
3.  **Level 2 (Floating):** Higher transparency, `blur(40px)`, and a subtle "inner glow" (1px white stroke on the top and left edges only) to simulate light hitting the edge of glass.
4.  **Accent Elevation:** Elements like active buttons or "glowing indicators" use a soft Gaussian blur shadow of the Secondary (Lime) or Tertiary (Blue) color to simulate a neon-emissive light source.

## Shapes
Shapes are defined by **Standard Roundedness** (0.5rem base), which strikes a balance between professional precision and organic softness. 

- Large containers and glass cards use `rounded-xl` (1.5rem) to feel friendly and modern.
- Form inputs and small buttons use `rounded-md` (0.5rem) for a tighter, more functional look.
- Indicators and badges utilize "Pill" shapes (full rounding) to contrast against the more structural card layouts.

## Components
- **Glass Cards:** The primary container. Must have a 1px "glass" border (white at 10% opacity) and a backdrop blur. No heavy shadows; use a dark 40% opacity blur for depth.
- **Buttons:** 
    - *Primary:* Solid Vibrant Lime with dark text. Apply a subtle outer glow of the same color.
    - *Secondary:* Ghost style with a 1px lime border and blurred background.
- **Progress Bars:** Dual-layered. A dark recessed track with a glowing, gradient-filled bar (Lime to Blue) representing "growth."
- **Glowing Indicators:** Small circular pips using a 4px blur shadow of the secondary color to denote "Live" AI processing or healthy system status.
- **Data Visualizations:** Use thin, high-contrast lines. Area charts should use semi-transparent gradients that mirror the oceanic blue and forest green palette.
- **Input Fields:** Dark, semi-transparent backgrounds. On focus, the border should glow with the Tertiary Blue color.