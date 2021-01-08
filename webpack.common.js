const path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  entry: {
    main: "./starter-theme/" + process.env.npm_package_client + "/index.ts",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Engaging Networks - Page Type Selection",
      template: "testing-pages/index.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
    }),
    new HtmlWebpackPlugin({
      title: "Engaging Networks Page - Donation",
      filename: "page-donation.html",
      template: "testing-pages/page-donation.html",
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: false,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs",
          },
        },
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/env", "@babel/preset-typescript"],
            plugins: [
              "@babel/proposal-class-properties",
              "@babel/proposal-object-rest-spread",
              "@babel/plugin-transform-runtime",
            ],
          },
        },
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
