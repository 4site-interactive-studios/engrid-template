const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  entry: {
    engrid: "./src/index.ts",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Engaging Networks - Page Type Selection",
      template: "./src/index.html",
      inject: false,
      minify: false,
    }),
    new HtmlWebpackPlugin({
      title: "Brand Guide",
      filename: "pages/brand-guide.html",
      template: "./src/templates/page-brand-guide.html",
      inject: false,
      minify: false,
    }),
    new HtmlWebpackPlugin({
      title: "Page - Free and Flexible",
      filename: "pages/free-and-flexible.html",
      template: "./src/templates/page-free-and-flexible.html",
      inject: false,
      minify: false,
    }),
    new HtmlWebpackPlugin({
      title: "Page - Donation",
      filename: "pages/donation.html",
      template: "./src/templates/page-donation.html",
      inject: false,
      minify: false,
    }),
    new HtmlWebpackPlugin({
      title: "Page - Thank You",
      filename: "pages/thank-you.html",
      template: "./src/templates/page-thank-you.html",
      inject: false,
      minify: false,
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
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: false,
              sources: false,
            },
          },
          {
            loader: "posthtml-loader",
            options: {
              ident: "posthtml",
              // skipParse: true,
              // parser: "PostHTML Parser",
              plugins: [require("posthtml-include")({ encoding: "utf8" })],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
