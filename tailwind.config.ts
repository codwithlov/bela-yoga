import type { Config } from "tailwindcss";
import { templateTheme } from "./config/template/theme";

const cssColor = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  // darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      aspectRatio: {
        '1/1': '1 / 1',
        '3/2': '3 / 2',
        '4/3': '4 / 3',
        '2/1': '2 / 1',
        '16/9': '16 / 9',
        '17/10': '17 / 10',
      },
      colors: {
        sgt: {
          primary: {
            light: cssColor('--template-color-primary-light-rgb'),
            default: cssColor('--template-color-primary-default-rgb'),
            dark: cssColor('--template-color-primary-dark-rgb'),
            '1': cssColor('--template-color-primary-dark-rgb'),
            '2': cssColor('--template-color-primary-default-rgb'),
            '3': cssColor('--template-color-primary-soft-rgb'),
            '4': cssColor('--template-color-background-soft-rgb'),
          },
          secondary: {
            light: cssColor('--template-color-secondary-light-rgb'),
            default: cssColor('--template-color-secondary-default-rgb'),
            dark: cssColor('--template-color-secondary-dark-rgb'),
            '1': cssColor('--template-color-secondary-dark-rgb'),
            '2': cssColor('--template-color-secondary-default-rgb'),
            '3': cssColor('--template-color-secondary-muted-rgb'),
            '4': cssColor('--template-color-secondary-soft-rgb'),
          },
          tertiary: {
            default: cssColor('--template-color-tertiary-default-rgb')
          },
          third: {
            '2': cssColor('--template-color-tertiary-default-rgb'),
          },
          neutral: {
            '1': cssColor('--template-color-neutral-1-rgb'),
            '2': cssColor('--template-color-neutral-2-rgb'),
            '3': cssColor('--template-color-neutral-3-rgb'),
            '4': cssColor('--template-color-neutral-4-rgb'),
            '5': cssColor('--template-color-neutral-5-rgb'),
            '6': cssColor('--template-color-neutral-6-rgb'),
            '7': cssColor('--template-color-neutral-7-rgb'),
          },
          gray: {
            '1': cssColor('--template-color-gray-1-rgb'),
            '2': cssColor('--template-color-gray-2-rgb'),
            '3': cssColor('--template-color-gray-3-rgb'),
          },
          'bg-primary': cssColor('--template-color-background-primary-rgb'),
          'bg-primary-1': cssColor('--template-color-background-soft-rgb'),
        },
        messenger: '#0099FF',
        tiktok: '#010101',
        youtube: '#FF0000',
        facebook: '#1877F2',
        zalo: '#006AF5'
      },
      fontSize: {
        '2xs': [
          '0.625rem',
          {
            lineHeight: '1rem',
          }
        ],
        'h1': [
          '2.5rem',
          {
            lineHeight: '1.21',
            fontWeight: 700
          }
        ],
        'h2': [
          '2rem',
          {
            lineHeight: '1.21',
            fontWeight: 700
          }
        ],
        'h3': [
          '1.5rem',
          {
            lineHeight: '1.21',
            fontWeight: 700
          }
        ],
        'h4': [
          '1.375rem',
          {
            lineHeight: '1.21',
            fontWeight: 700
          }
        ],
        'sub-1': [
          '1rem',
          {
            lineHeight: '1.21',
            fontWeight: 600
          }
        ],
        'body-1': [
          '0.875rem',
          {
            lineHeight: '1.21',
            fontWeight: 600
          }
        ],
        'body-2': [
          '0.875rem',
          {
            lineHeight: '1.28',
            fontWeight: 400
          }
        ],
        'button': [
          '0.875rem',
          {
            lineHeight: '1.36',
            fontWeight: 600
          }
        ],
        'cap-1': [
          '0.75rem',
          {
            lineHeight: '1.21',
            fontWeight: 400
          }
        ]
      },
      boxShadow: {
        "shadow-top-sm": "0 5px 20px 0 rgba(0, 0, 0, 0.3)",
        "sgt-primary": "0 12px 32px 0 rgba(0, 136, 240, 0.24)",
        "sgt-black-1": "0 2px 4px 0 rgba(0, 0, 0, 0.25)",
        "sgt-black-2": "0 2px 2px 0 rgba(0, 0, 0, 0.15)",
        "sgt-black-3": "0 2px 4px 0 rgba(0, 0, 0, 0.4)",
        "sgt-black-4": "0 0 8px 0 rgba(0, 0, 0, 0.25)",
        "sgt-black-5": "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
        "sgt-black-6": "0 4px 4px 0 rgba(0, 0, 0, 0.4)",
        "sgt-black-7": "0 4px 4px 0 rgba(0, 0, 0, 0.3)",
        "sgt-black-8": "0 2px 2px 0 rgba(0, 0, 0, 0.25)",
        "sgt-black-9": "0 0 2px 0 rgba(0, 0, 0, 0.25)",
        "sgt-black-10": "0 0 4px 0 rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        'sgt-10': templateTheme.layout.radius === 12 ? '0.625rem' : `${templateTheme.layout.radius}px`
      },
      screens: {
        'xs': '412px',
      },
    },
  },
  plugins: [],
};
export default config;


