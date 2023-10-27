const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// NOTE: there is another webpack related package imported in this project you can find int he package.json: "webpack-dev-server"
// this package allows you to use the `webpack server` command.
// what this does is it creates a lightweight server running on your machine that serves the resources webpack outputs
// this server is accessible only over a local port on your machine, so it's not on the internet.

module.exports = {
  mode: "development",
  entry: "./exampleApp/index.js",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  resolve: {
    // this tells webpack that it's supposed to try to bundle files with these three extension
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      // the below object tells webpack to use the babel loader on any files with a .js or .jsx extension
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    // this plugin tells webpack to use a specific HTML file as a template to add the bundle it creates to as a script tag
    // webpack will copy said file, alter the copy, and put that copy in the output directory specified above in the "output" section
    new HtmlWebpackPlugin({
      template: "exampleApp/index.html",
    }),
    // this plugin tells webpack to copy certain files into the output directory specified above in the "output" section
    new CopyPlugin({
      patterns: [
        "./exampleApp/styles.css"
      ],
    }),
  ],
};