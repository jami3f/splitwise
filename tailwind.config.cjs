/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "inf-scroll": {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "inf-scroll": "inf-scroll 10s linear infinite",
      },
      width: {
        "200%": "200%",
      },
      gridTemplateColumns: {
        "75/25": "3fr 1fr",
      }
    },
  },
  plugins: [],
};
