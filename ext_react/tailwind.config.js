/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html","./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
    colors: {
      "hover":"#383f47",
      "blue":"#3730a3",
      'metal': '#565584',
    },
  },
  plugins: [require("flowbite/plugin")],
};
