/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark backgrounds
        "gray-20": "#1A1A1A",      // Dark background
        "gray-50": "#262626",      // Slightly lighter dark
        "gray-100": "#404040",     // Medium dark
        "gray-500": "#A8A8A8",     // Light gray for text on dark
        
        // Primary - Teal/Blue-Green (calming, professional)
        "primary-100": "#C8E6E6",  // Very light teal
        "primary-300": "#7AACBA",  // Medium teal (input fields)
        "primary-500": "#5D9CAC",  // Main teal
        
        // Secondary - Deeper Teal (for variety)
        "secondary-400": "#6B9FAE",  // Light deeper teal
        "secondary-500": "#4A7C8C",  // Medium teal
        "secondary-600": "#3B6370",  // Dark teal
        
        // Accent - Golden Yellow/Amber (for CTAs)
        "accent-400": "#F5C563",    // Light gold
        "accent-500": "#E6B047",    // Golden yellow (Register button)
        "accent-600": "#D4A03A",    // Deep gold
      },
      backgroundImage: (theme) => ({
        "gradient-teal": "linear-gradient(135deg, #5D9CAC 0%, #7AACBA 100%)",
        "gradient-tealgold": "linear-gradient(135deg, #5D9CAC 0%, #E6B047 100%)",
        "gradient-ocean": "linear-gradient(180deg, #C8E6E6 0%, #7AACBA 100%)",
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