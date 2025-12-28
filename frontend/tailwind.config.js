/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "gray-20": "#1A1A1A",      // Dark background
        "gray-50": "#262626",      // Slightly lighter dark
        "gray-100": "#404040",     // Medium dark
        "gray-500": "#A8A8A8",     // Light gray for text on dark
        
        // Primary - Deep Orange-Red (energetic, motivating - Nike/Peloton style)
        "primary-100": "#FFAD99",  // Light orange-red
        "primary-300": "#FF7A59",  // Medium orange-red
        "primary-500": "#E8590C",  // Deep orange-red (main action color)
        
        // Secondary - Burnt Orange/Terracotta (warm, athletic)
        "secondary-400": "#FF9E6D",  // Light orange
        "secondary-500": "#FF7A3D",  // Burnt orange
        "secondary-600": "#D94F0A",  // Darker orange
        
        // Accent - Gold/Amber (achievement, energy)
        "accent-400": "#FFC857",    // Light gold
        "accent-500": "#FFB020",    // Bright amber
        "accent-600": "#F59E0B",    // Deep amber
      },
      backgroundImage: (theme) => ({
        "gradient-sunset": "linear-gradient(135deg, #E8590C 0%, #FFB020 100%)",
        "gradient-fire": "linear-gradient(135deg, #FF7A3D 0%, #E8590C 100%)",
        "gradient-warm": "linear-gradient(180deg, #FFF5F0 0%, #FFE8DC 100%)",
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