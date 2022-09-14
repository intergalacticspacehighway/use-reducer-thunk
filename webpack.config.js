const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
  mode: "production",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts"],
  },
  externals: {
    react: "commonjs react",
  },
};
