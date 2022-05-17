module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    textShadow: {
      default: "1px 1px 0 #004c3f",
    },
    extend: {
      colors: {
        bbGreen: {
          100: "#bbce8a",
          200: "#009379",
          300: "#004c3f",
        },
        bbBlue: {
          100: "#c1edfb",
          200: "#5551ff",
        },
        bbYellow: {
          100: "#fbf7ec",
          200: "#ffe7a4",
          300: "#ffc700",
        },
        bbGray: {
          100: "#3f3e3c",
        },
        bbRed: {
          100: "#e2252b",
        },
      },
    },
  },
  plugins: [require("tailwindcss-textshadow")],
};
