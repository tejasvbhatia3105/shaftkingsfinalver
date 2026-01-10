import type { Config } from 'tailwindcss';
import { colors } from './packages/utils/colors';

const config: Config = {
  content: [
    './packages/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './packages/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        vcr: ['"VCR OSD Mono"', 'monospace'],
        poppins: ['poppins'],
      },
      colors,
      screens: { '3xl': '1680px' },
      boxShadow: {
        custom: '0 4px 16px 4px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'rotate-360': 'spin 1.5s linear infinite',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require('tailwindcss-animated'),
  ],
};
export default config;
