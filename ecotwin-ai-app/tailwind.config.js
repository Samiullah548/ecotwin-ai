import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "error": "var(--color-error, #ffb4ab)",
        "outline": "var(--color-outline, #8c928f)",
        "surface-dim": "var(--color-surface-dim, #0c1513)",
        "on-background": "var(--color-on-background, #dbe5e1)",
        "primary": "var(--color-primary, #b0cdc2)",
        "surface-container-high": "var(--color-surface-container-high, #232c29)",
        "tertiary": "var(--color-tertiary, #afc6ff)",
        "on-tertiary-fixed-variant": "var(--color-on-tertiary-fixed-variant, #004299)",
        "on-primary": "var(--color-on-primary, #1c352e)",
        "surface": "var(--color-surface, #0c1513)",
        "on-error-container": "var(--color-on-error-container, #ffdad6)",
        "secondary-fixed": "var(--color-secondary-fixed, #c8f323)",
        "on-primary-fixed": "var(--color-on-primary-fixed, #052019)",
        "on-error": "var(--color-on-error, #690005)",
        "tertiary-fixed": "var(--color-tertiary-fixed, #d9e2ff)",
        "error-container": "var(--color-error-container, #93000a)",
        "on-tertiary-fixed": "var(--color-on-tertiary-fixed, #001944)",
        "surface-variant": "var(--color-surface-variant, #2d3734)",
        "on-secondary": "var(--color-on-secondary, #293500)",
        "on-tertiary": "var(--color-on-tertiary, #002d6d)",
        "surface-bright": "var(--color-surface-bright, #323b39)",
        "primary-fixed": "var(--color-primary-fixed, #cce9de)",
        "outline-variant": "var(--color-outline-variant, #424845)",
        "on-primary-container": "var(--color-on-primary-container, #769188)",
        "primary-container": "var(--color-primary-container, #0f2922)",
        "surface-container-low": "var(--color-surface-container-low, #141d1b)",
        "surface-tint": "var(--color-surface-tint, #b0cdc2)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant, #3d4d00)",
        "surface-container": "var(--color-surface-container, #18211f)",
        "secondary-container": "var(--color-secondary-container, #b8e100)",
        "tertiary-container": "var(--color-tertiary-container, #002255)",
        "on-surface-variant": "var(--color-on-surface-variant, #c1c8c4)",
        "on-secondary-container": "var(--color-on-secondary-container, #4e6100)",
        "inverse-on-surface": "var(--color-inverse-on-surface, #293230)",
        "secondary": "var(--color-secondary, #d3fe32)",
        "inverse-surface": "var(--color-inverse-surface, #dbe5e1)",
        "tertiary-fixed-dim": "var(--color-tertiary-fixed-dim, #afc6ff)",
        "on-secondary-fixed": "var(--color-on-secondary-fixed, #171e00)",
        "background": "var(--color-background, #0c1513)",
        "surface-container-highest": "var(--color-surface-container-highest, #2d3734)",
        "on-primary-fixed-variant": "var(--color-on-primary-fixed-variant, #324c44)",
        "on-surface": "var(--color-on-surface, #dbe5e1)",
        "secondary-fixed-dim": "var(--color-secondary-fixed-dim, #aed500)",
        "inverse-primary": "var(--color-inverse-primary, #4a645b)",
        "surface-container-lowest": "var(--color-surface-container-lowest, #07100e)",
        "on-tertiary-container": "var(--color-on-tertiary-container, #4787ff)",
        "primary-fixed-dim": "var(--color-primary-fixed-dim, #b0cdc2)"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "margin-tablet": "32px",
        "margin-mobile": "20px",
        "unit": "8px",
        "gutter": "24px",
        "container-max": "1440px",
        "margin-desktop": "64px"
      },
      "fontFamily": {
        "display-lg": ["Montserrat"],
        "label-sm": ["Inter"],
        "headline-md": ["Montserrat"],
        "headline-lg-mobile": ["Montserrat"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Montserrat"]
      },
      "fontSize": {
        "display-lg": ["64px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "label-sm": ["12px", { "lineHeight": "1.4", "fontWeight": "500" }],
        "headline-md": ["24px", { "lineHeight": "1.3", "fontWeight": "600" }],
        "headline-lg-mobile": ["32px", { "lineHeight": "1.2", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400" }],
        "body-md": ["16px", { "lineHeight": "1.6", "fontWeight": "400" }],
        "label-md": ["14px", { "lineHeight": "1.4", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-lg": ["40px", { "lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600" }]
      }
    },
  },
  plugins: [
    forms,
    containerQueries,
  ],
}
