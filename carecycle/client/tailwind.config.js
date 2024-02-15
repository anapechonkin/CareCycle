/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#0D5A67',
        'custom-teal': '#16839B',
      },
    },
  },
  plugins: [],
}

