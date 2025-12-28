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
        
        // Primary - Fresh Green (energetic, growth, health)
        "primary-100": "#D4EDDA",  // Very light green
        "primary-300": "#7BC96F",  // Light fresh green
        "primary-500": "#4CAF50",  // Main green (Material Design green)
        
        // Secondary - Lime/Yellow-Green (vibrant, energetic)
        "secondary-400": "#9CCC65",  // Light lime green
        "secondary-500": "#8BC34A",  // Lime green
        "secondary-600": "#7CB342",  // Deep lime green
        
        // Accent - Golden Yellow (warm complement)
        "accent-400": "#FFD54F",    // Light golden yellow
        "accent-500": "#FFC107",    // Amber/golden yellow
        "accent-600": "#FFA000",    // Deep amber
      },
      backgroundImage: (theme) => ({
        "gradient-green": "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
        "gradient-fresh": "linear-gradient(135deg, #7BC96F 0%, #FFC107 100%)",
        "gradient-nature": "linear-gradient(180deg, #D4EDDA 0%, #7BC96F 100%)",
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