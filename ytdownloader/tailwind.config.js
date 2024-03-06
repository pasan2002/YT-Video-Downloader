/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "bg-color" : "#7F27FF",
        "txt-color" : "#ffc107"
      }
    },
  },
  plugins: [],
}