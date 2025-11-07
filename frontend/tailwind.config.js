/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme:{
    extend: {
      colors: {
        "gray-20": "#F8F4EB",
        "gray-50": "#EFE6E6",
        "gray-100": "#DFCCCC",
        "gray-500": "#5E0000",
        "primary-100": "#FFE1E0",
        "primary-300": "#FFA6A3",
        "primary-500": "#FF6B66",
        "secondary-400": "#FFCD58",
        "secondary-500": "#FFC132",
      },
      backgroundImage: (theme) => ({
        "gradient-yellowred": "linear-gradient(90deg, #FF616A 0%, #FFC837)",
        "mobile-home": "url('./assests/HomePageGraphic.png')",
      }),
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },

      content: {
        evolvetext: "url('./assests/EvolveText.png')",
        abstractwaves: "url('./assests/AbstractWaves.png')",
        sparkles: "url('./assests/Sparkles.png')",
        circles: "url('./assests/Circles.png')",
      }
    },

    screens: {
      xs: "480px", 
      sm: "768px",
      md: "1060px",
    }
  },

  plugins: [],

};
