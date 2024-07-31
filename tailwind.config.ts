/** @type {import('tailwindcss').Config} */

module.exports = {
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
      },
      colors: {
        grey0: "#F8F9FA",
        grey1: "#E9E9E9",
        grey2: "#E1E1E1",
        grey3: "#B7B7B7",
        grey4: "#7C7C7C"
      },
      fontSize: {
        extraLarge: "24px",
        large: "22px",
        medium: "16px",
        small: "14px",
        extraSmall: "12px"
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cmyk"]
  }
};
