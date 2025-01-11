export default {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {}, // This should be default be using SASS nesting, not CSS native nesting
    "postcss-simple-vars": {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
