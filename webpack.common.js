const exec = require("child_process").execSync;
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpack = require("webpack");
const author = require("os").userInfo().username;
let engridScriptStylesVersion = exec("npm list @4site/engrid-styles")
  .toString("utf8")
  .split("@4site/engrid-styles@")[1]
  .split("\n")[0];
const engridScriptScriptsVersion = exec("npm list @4site/engrid-common")
  .toString("utf8")
  .split("@4site/engrid-common@")[1]
  .split("\n")[0];
const localeStringDateOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const localeStringTimeOptions = {
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "America/New_York",
};

module.exports = {
  entry: {
    engrid: "./src/index.ts",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: `
               ((((                                                        
         ((((((((                                                          
      (((((((                                                              
    (((((((           ****                                                 
  (((((((          *******                                                 
 ((((((((       **********     *********       ****    ***                 
 ((((((((    ************   **************     ***    ****                 
 ((((((   *******  *****   *****        *     **    ******        *****    
 (((   *******    ******   ******            ****  ********   ************ 
     *******      *****     **********      ****    ****     ****      ****
   *********************         *******   *****   ****     ***************
    ********************            ****   ****    ****    ****            
                *****    *****   *******  *****   *****     *****     **   
               *****     *************    ****    *******     **********   
 
 ENGRID PAGE TEMPLATE ASSETS
 
 Date: ${new Date().toLocaleString(
   "en-US",
   localeStringDateOptions
 )} @ ${new Date().toLocaleString("en-US", localeStringTimeOptions)} ET
 By: ${author}
 ENGrid styles: v${engridScriptStylesVersion}
 ENGrid scripts: v${engridScriptScriptsVersion}
 
 Created by 4Site Studios
 Come work with us or join our team, we would love to hear from you
 https://www.4sitestudios.com/en
`,
    }),
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
