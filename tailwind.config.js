// tailwind.config.js
export const darkMode = 'class';
export const content = ['./src/**/*.{js,ts,jsx,tsx}'];
export const theme = {
  extend: {
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'scale(0.95)' },
        '100%': { opacity: '1', transform: 'scale(1)' },
      },
    },
    animation: {
      'fade-in': 'fadeIn 0.2s ease-in-out',
    },
  },
};
export const plugins = [];
