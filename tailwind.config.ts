import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: '#D2569A',
        'pink-deep': '#B23F80',
        blue: '#5AA8D6',
        yellow: '#EFC06B',
        green: '#9CC47C',
        ink: '#4A3B72',
        'ink-soft': '#6B5C93',
        cream: '#FBF8F5',
        card: '#FFFFFF',
      },
      fontFamily: {
        heading: ['var(--font-readex)', 'system-ui', 'sans-serif'],
        body: ['var(--font-almarai)', 'system-ui', 'sans-serif'],
        latin: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(74, 59, 114, 0.28)',
        'soft-lg': '0 32px 80px -32px rgba(74, 59, 114, 0.32)',
        'soft-sm': '0 10px 30px -18px rgba(74, 59, 114, 0.30)',
      },
      maxWidth: {
        content: '68rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
