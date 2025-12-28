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
        
        // Primary - Deep Orange-Red (main brand color - energetic, motivating)
        "primary-100": "#F5F5F5",  // Light gray (no more peach!)
        "primary-300": "#FF6B3D",  // Medium orange-red
        "primary-500": "#E8590C",  // Deep orange-red (MAIN ACTION COLOR)
        
        // Secondary - Warm Red (complement to orange)
        "secondary-400": "#FF6B6B",  // Light warm red
        "secondary-500": "#E63946",  // Vibrant red
        "secondary-600": "#C1121F",  // Deep red
        
        // Accent - Golden Yellow (warm complement)
        "accent-400": "#FFD166",    // Light golden yellow
        "accent-500": "#FFB020",    // Bright golden yellow
        "accent-600": "#F59E0B",    // Deep amber/gold
      },
      backgroundImage: (theme) => ({
        "gradient-sunset": "linear-gradient(135deg, #E8590C 0%, #FFB020 100%)",
        "gradient-fire": "linear-gradient(135deg, #E63946 0%, #E8590C 100%)",
        "gradient-warm": "linear-gradient(135deg, #E8590C 0%, #FFD166 100%)",
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