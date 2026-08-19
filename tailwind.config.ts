import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        safari: {
          50: "#faf8f5",
          100: "#f4efe6",
          200: "#e8ddcc",
          300: "#d7c4a8",
          400: "#c4a781",
          500: "#b58e61",
          600: "#a2764e",
          700: "#835b3e",
          800: "#6d4b35",
          900: "#5a3e2e",
          950: "#322017",
        },
        gold: {
          50: "#fbf8ec",
          100: "#f6eece",
          200: "#ecda99",
          300: "#e0c15e",
          400: "#d5aa32",
          500: "#c5921f",
          600: "#a97418",
          700: "#865416",
          800: "#704318",
          900: "#5f3818",
          950: "#381d09",
        },
        obsidian: {
          800: "#18202b",
          850: "#131a23",
          900: "#0c1117",
          950: "#070a0e",
        },
        swahili: {
          teal: "#0e4b47",
          coral: "#e06d53",
          sand: "#f5f0e6",
        }
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(212, 175, 55, 0.15)',
        'luxury-gold': '0 10px 30px -5px rgba(197, 146, 31, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-shimmer': 'linear-gradient(110deg, #b58e61 0%, #f6eece 50%, #b58e61 100%)',
      }
    },
  },
  plugins: [],
};
export default config;
