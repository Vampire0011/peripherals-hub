import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "hsl(240 10% 4%)",
        foreground: "hsl(0 0% 98%)",
        border: "hsl(240 6% 16%)",
        card: "hsl(240 8% 8%)",
        "card-hover": "hsl(240 8% 11%)",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#22D3EE",
          foreground: "#04121a",
        },
        muted: {
          DEFAULT: "hsl(240 5% 15%)",
          foreground: "hsl(240 5% 65%)",
        },
        destructive: "#EF4444",
        success: "#22C55E",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.15), transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
