/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral backgrounds
        "gray-20": "#F8F9FA",
        "gray-50": "#F1F3F5",
        "gray-100": "#E9ECEF",
        "gray-500": "#495057",
        
        // Primary - Teal (from logo)
        "primary-100": "#C8DDE4",  // Light teal
        "primary-300": "#7AACBA",  // Medium teal
        "primary-500": "#4A7C8C",  // Main teal (logo background)
        
        // Secondary - Gold (from logo)
        "secondary-400": "#F9D67A",  // Light gold
        "secondary-500": "#F5B93D",  // Main gold (logo trophy)
        "secondary-600": "#E09F1A",  // Dark gold
        
        // Accent - Complementary coral/orange for CTAs
        "accent-400": "#FF9B7F",    // Light coral
        "accent-500": "#FF7A59",    // Main coral
        "accent-600": "#E65A3A",    // Dark coral
      },
      backgroundImage: (theme) => ({
        "gradient-tealgold": "linear-gradient(90deg, #4A7C8C 0%, #F5B93D 100%)",
        "gradient-tealcoral": "linear-gradient(90deg, #4A7C8C 0%, #FF7A59 100%)",
      }),
      fontFamily: {
        dmsans: ["DM Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"]
      },
      content: {
        evolvetext: "url('./assets/EvolveText.png')",
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