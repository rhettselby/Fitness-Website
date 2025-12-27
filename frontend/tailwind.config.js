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
        
        // Primary - Cyan/Turquoise (from logo right side - bright)
        "primary-100": "#D4F1F4",  // Very light cyan
        "primary-300": "#75E6DA",  // Light cyan
        "primary-500": "#189AB4",  // Main cyan (logo bright side)
        
        // Secondary - Deep Teal/Blue (from logo left side - dark)
        "secondary-400": "#3D5A80",  // Medium blue-teal
        "secondary-500": "#05445E",  // Main dark teal (logo dark side)
        "secondary-600": "#003147",  // Darkest teal
        
        // Accent - Vibrant cyan for CTAs and highlights
        "accent-400": "#67E8F9",    // Light bright cyan
        "accent-500": "#22D3EE",    // Vibrant cyan
        "accent-600": "#0891B2",    // Deep cyan
      },
      backgroundImage: (theme) => ({
        "gradient-logomatch": "linear-gradient(90deg, #05445E 0%, #189AB4 100%)",  // Matches logo gradient
        "gradient-reverse": "linear-gradient(90deg, #189AB4 0%, #05445E 100%)",
        "gradient-cyan": "linear-gradient(135deg, #75E6DA 0%, #189AB4 100%)",
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