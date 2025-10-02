/** Tailwind configuration drives utility scanning and theme tokens across the app. */
export default {
  // Every file path listed here is scanned so Tailwind can tree-shake unused classes.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Extend will hold custom color palettes or spacing values as the design evolves.
    extend: {},
  },
  // Add official or community plugins here when we need extra utilities or components.
  plugins: [],
}
