export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 70px rgba(15, 23, 42, 0.30)',
        soft: '0 24px 80px rgba(15, 23, 42, 0.15)',
        'mint-glow': '0 0 20px rgba(46, 204, 138, 0.3), 0 0 40px rgba(46, 204, 138, 0.1)',
        'mint-glow-strong': '0 0 30px rgba(46, 204, 138, 0.5), 0 0 60px rgba(46, 204, 138, 0.2)',
      },
      colors: {
        // Editorial Mint Design System
        cream: '#f0f4f2',
        dark: '#0d1a15',
        'primary-dark': '#0d1a15',
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#2ecc8a', // Primary Mint Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#0d1a15', // Dark Forest Background
        },
        // Keep existing brand colors for compatibility
        brand: {
          950: '#0d1a15', // Updated to Dark Forest
          900: '#14532d',
          800: '#166534',
          700: '#15803d',
        },
        purple: {
          950: '#0b0a16',
        },
      },
      fontFamily: {
        'bebas': ['Bebas Neue', 'cursive'],
        'archivo': ['Archivo', 'sans-serif'],
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'scroll-ticker': 'scroll 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(46, 204, 138, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(46, 204, 138, 0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderColor: {
        'mint': 'rgba(46, 204, 138, 0.5)',
        'mint-strong': 'rgba(46, 204, 138, 0.8)',
      },
    },
  },
  plugins: [],
}
