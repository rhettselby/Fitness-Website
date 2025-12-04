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
        "gray-500": "#1F2937",
        "primary-100": "#DBEAFE", // Light blue
        "primary-300": "#60A5FA", // Medium blue
        "primary-500": "#2563EB", // Strong blue
        "secondary-400": "#FCD34D", // Light yellow
        "secondary-500": "#F59E0B", // Strong yellow
        "accent-400": "#34D399", // Light green
        "accent-500": "#10B981", // Medium green
        "accent-600": "#059669", // Dark green
      },
      backgroundImage: (theme) => ({
        "gradient-blueyellow": "linear-gradient(90deg, #2563EB 0%, #F59E0B)",
        "gradient-bluegreen": "linear-gradient(90deg, #2563EB 0%, #10B981)",
        "gradient-yellowgreen": "linear-gradient(90deg, #F59E0B 0%, #10B981)",
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
