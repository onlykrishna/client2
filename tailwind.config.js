/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kerala: {
          green:  '#1a5e2a',   // Deep Kerala forest green
          gold:   '#d4a017',   // Jackpot gold
          red:    '#c0392b',   // Kerala red (from flag)
          cream:  '#fdf6e3',   // Warm background
          dark:   '#0d2b14',   // Deep dark green
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],    // For prize amounts & titles
        body:    ['Noto Sans Malayalam', 'sans-serif'], // Kerala bilingual support
        mono:    ['JetBrains Mono', 'monospace'],  // Ticket numbers
      },
      backgroundImage: {
        'lottery-pattern': "url('/assets/kerala-pattern.svg')",
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
