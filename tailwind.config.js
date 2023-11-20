/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    // Or if using `src` directory:
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  // Add any other Tailwind CSS configurations here
};
