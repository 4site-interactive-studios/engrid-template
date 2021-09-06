const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require('webpack');
const author = require("os").userInfo().username;
const engridScriptStylesVersion = 'TBD1';
const engridScriptScriptsVersion = 'TBD2';
const localeStringDateOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const localeStringTimeOptions = {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit', timeZone: 'America/New_York' };

module.exports = {
  entry: {
    engrid: "./src/index.ts",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.BannerPlugin({
      banner:`*************************************************
ENGRID PAGE TEMPLATE ASSETS

Date: ${new Date().toLocaleString('en-US', localeStringDateOptions)} @ ${new Date().toLocaleString('en-US', localeStringTimeOptions)} ET
By: ${author}
ENGrid styles: v${engridScriptStylesVersion}
ENGrid scripts: v${engridScriptScriptsVersion}

*************************************************`
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ttf,oft,woff,woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "fonts",
          },
        },
      },
      {
        test: /\.(svg|png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
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
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
