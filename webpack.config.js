const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "Q.js",
    library: "Q",
    libraryTarget: "var",
  },
  mode: "production",

  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      perf_hooks: false,
    }
  }
};
