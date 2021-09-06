const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: false },
              normalizeWhitespace: false,
            },
          ],
        },
        minify: [CssMinimizerPlugin.cssnanoMinify],
      }),
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: "[name].css" })],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // 4. Save css to files
          "css-loader", // 3. From css to vanilla js
          "postcss-loader", // 2. Add Autoprefixer to CSS
          {
            loader: "sass-loader", // 1. From SASS to CSS
            options: {
              sassOptions: {
                outputStyle: "expanded",
              },
            },
          },
        ],
      },
    ],
  },
});
