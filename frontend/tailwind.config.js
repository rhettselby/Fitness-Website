/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral backgrounds - darker for athletic feel
        "gray-20": "#F5F5F5",
        "gray-50": "#E5E5E5",
        "gray-100": "#D4D4D4",
        "gray-500": "#737373",
        
        // Primary - Black/Dark (main brand color)
        "primary-100": "#404040",  // Light dark gray
        "primary-300": "#262626",  // Medium dark gray
        "primary-500": "#0A0A0A",  // Near black (main color)
        
        // Secondary - Electric Neon (your choice between these)
        "secondary-400": "#4ADE80",  // Lighter neon green
        "secondary-500": "#22C55E",  // Neon/Lime green
        "secondary-600": "#16A34A",  // Darker green
        
        // OR use Electric Blue instead - uncomment these and comment out green above
        // "secondary-400": "#38BDF8",  // Light electric blue
        // "secondary-500": "#0EA5E9",  // Electric blue
        // "secondary-600": "#0284C7",  // Dark electric blue
        
        // Accent - Vibrant highlights (bright cyan from your logo as accent)
        "accent-400": "#67E8F9",    // Light cyan
        "accent-500": "#06B6D4",    // Vibrant cyan (from logo)
        "accent-600": "#0891B2",    // Deep cyan
      },
      backgroundImage: (theme) => ({
        "gradient-athletic": "linear-gradient(135deg, #0A0A0A 0%, #262626 100%)",
        "gradient-neon": "linear-gradient(135deg, #22C55E 0%, #06B6D4 100%)",
        "gradient-dark": "linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)",
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