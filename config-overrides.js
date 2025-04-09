const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify/browser"),
    https: require.resolve("https-browserify"),
    http: require.resolve("stream-http"),
    url: require.resolve("url"),
    buffer: require.resolve("buffer"),
    process: require.resolve("process/browser"),
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ];

  return config;
};    