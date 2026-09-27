module.exports = {
  webpack: {
    configure: (webpackConfig) => {
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

      webpackConfig.module.strictExportPresence = false;
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];

      return webpackConfig;
    },
  },
};
