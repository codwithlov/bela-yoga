export const templateTheme = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", sans-serif',
  colors: {
    primaryLight: '#38d7ff',
    primaryDefault: '#0088f0',
    primaryDark: '#0067c8',
    secondaryLight: '#123a59',
    secondaryDefault: '#082033',
    secondaryDark: '#04121f',
    tertiaryDefault: '#68e048',
    neutral1: '#0f172a',
    neutral2: '#334155',
    neutral3: '#64748b',
    neutral4: '#94a3b8',
    neutral5: '#e2e8f0',
    neutral6: '#f8fafc',
    neutral7: '#ffffff',
    gray1: '#cbd5e1',
    gray2: '#e2e8f0',
    gray3: '#f1f5f9',
    backgroundPrimary: '#f2fbff',
    backgroundPrimarySoft: '#eafbff',
  },
  layout: {
    maxWidth: '1222px',
    radius: 12,
    radiusLg: '2rem',
  },
} as const;

export type TemplateTheme = typeof templateTheme;
