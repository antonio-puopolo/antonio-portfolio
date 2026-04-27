import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          soft: '#1c1c1c',
          muted: '#6b6b6b',
        },
        bone: {
          DEFAULT: '#F5F1EA',
          warm: '#EFE9DD',
          deep: '#E5DED0',
        },
        forest: {
          DEFAULT: '#1F3A2E',
          deep: '#15291F',
          soft: '#2D5142',
        },
        urgent: {
          overdue: '#B23A2A',
          today: '#C98A2B',
          future: '#9CA3AF',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(17, 17, 17, 0.04), 0 4px 16px rgba(17, 17, 17, 0.04)',
        sheet: '0 -8px 32px rgba(17, 17, 17, 0.12)',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
