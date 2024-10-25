// const purgecss = require("@fullhuman/postcss-purgecss")({
//   content: ["./hugo_stats.json"],
//   defaultExtractor: (content) => {
//     const els = JSON.parse(content).htmlElements;
//     return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
//   },
//   safelist: [],
// });

const config = {
  plugins: [
    require("autoprefixer"),
    require("tailwindcss"),
    require("postcss-import"),
    // ...(process.env.HUGO_ENVIRONMENT === "production" ? [purgecss] : []),
  ],
};

module.exports = config;
