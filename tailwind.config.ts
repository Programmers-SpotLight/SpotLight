import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      }
    },
    colors: {
      grey0: "F8F9FA",
      grey1: "E9E9E9",
      grey2: "E1E1E1",
      grey3: "B7B7B7",
      grey: "7C7C7C"
    },
    fontSize: {
      extraLarge: "24px",
      Large: "22px",
      Medium: "16px",
      small: "14px",
      extraSmall: "12px"
    }
  },
  plugins: [],
  daisyui: {
    themes: ["cmyk"]
  }
};

export default config;
