import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: { max: "767px" },
        md: { min: "768px", max: "1279px" },
        lg: "1280px",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "16px",
          md: "24px",
          lg: "32px",
        },
        screens: {
          md: "768px",
          lg: "1280px",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
