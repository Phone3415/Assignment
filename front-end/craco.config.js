module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 1. Fix Excalidraw / fullySpecified module resolution for .mjs / .js
      webpackConfig.module.rules.forEach((rule) => {
        (rule.oneOf || []).forEach((oneOf) => {
          if (oneOf.type === "javascript/auto") {
            oneOf.resolve = { ...oneOf.resolve, fullySpecified: false };
          }
        });
      });

      webpackConfig.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      });

      // 2. Remove source-map-loader to fix ENOENT sourcemap errors in node_modules
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        (rule) =>
          !(
            rule.enforce === "pre" &&
            rule.use &&
            Array.isArray(rule.use) &&
            rule.use.some(
              (u) => u.loader && u.loader.includes("source-map-loader"),
            )
          ),
      );

      // 3. Ignore strict export presence for excalidraw chunk bugs
      webpackConfig.module.strictExportPresence = false;

      // Also ignore warnings from Webpack
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
};
