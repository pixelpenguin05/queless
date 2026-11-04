import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Figma Foundations & Zomato Fusion Palette
        teal: {
          500: '#1D6E72',
          700: '#2E5A66',
          900: '#1A3D4F',
        },
        gold: {
          100: '#FBF1D4',
          500: '#E8B92C',
          600: '#DBA81F',
        },
        cream: {
          50: '#FAF7F2',
          100: '#F5EFE6',
          200: '#EFE8DC',
        },
        ink: {
          400: '#8E9A9E',
          500: '#6B6B6B',
          700: '#5F6B6F',
          900: '#1F292E',
        },
        line: {
          200: '#EAE5DC',
          500: '#8A7F70',
        },
        // Zomato Signature Red Palette
        zomato: {
          50: '#FFF5F5',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#E23744',
          600: '#CB202D',
          700: '#9F1239',
          800: '#881337',
          900: '#4C0519',
        },
        // Brand mappings
        brand: {
          50: '#FFF5F5',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#E23744',
          600: '#CB202D',
          700: '#9F1239',
          800: '#881337',
          900: '#4C0519',
        },
        primary: {
          DEFAULT: '#2E5A66',
          dark: '#1A3D4F',
          light: '#1D6E72',
        },
        accent: {
          DEFAULT: '#E8B92C',
          hover: '#DBA81F',
          light: '#FBF1D4',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        playfair: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Manrope', 'sans-serif'],
        manrope: ['var(--font-sans)', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(46, 90, 102, 0.07)',
        'elevated': '0 12px 32px -4px rgba(226, 55, 68, 0.15)',
        'float': '0 20px 40px -10px rgba(26, 61, 79, 0.12)',
        'zomato': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;