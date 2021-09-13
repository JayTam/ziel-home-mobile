const withTM = require("next-transpile-modules")(["lodash-es"]);

module.exports = withTM({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  reactStrictMode: true,
});
