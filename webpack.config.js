const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./exampleApp/index.js",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "exampleApp/index.html",
    }),
    new CopyPlugin({
      patterns: [
        "./exampleApp/styles.css"
      ],
    }),
  ],
};