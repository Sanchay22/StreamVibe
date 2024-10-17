/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(91,9,121,1) 100%, rgba(0,212,255,1) 100%)',
      },
    },
  },
  plugins: [],
}