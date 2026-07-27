export const templateTheme = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
  colors: {
    primaryLight: '#f3e7d7',
    primaryDefault: '#d2b48c',
    primaryDark: '#b08968',
    secondaryLight: '#8b6b4e',
    secondaryDefault: '#6f533d',
    secondaryDark: '#4f3a2a',
    tertiaryDefault: '#c9a27e',
    neutral1: '#2f241d',
    neutral2: '#5a4638',
    neutral3: '#7a6556',
    neutral4: '#a39182',
    neutral5: '#e8ddd0',
    neutral6: '#faf6f1',
    neutral7: '#ffffff',
    gray1: '#d8ccbf',
    gray2: '#eee5dc',
    gray3: '#f7f2ec',
    backgroundPrimary: '#fffdf9',
    backgroundPrimarySoft: '#f9f3eb',
  },
  layout: {
    maxWidth: '1222px',
    radius: 12,
    radiusLg: '2rem',
  },
} as const;

export type TemplateTheme = typeof templateTheme;
