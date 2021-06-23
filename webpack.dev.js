const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", //4. Inject CSS into DOM
          "css-loader", // 3. From css to vanilla js
          // "postcss-loader", // 2. Add Autoprefixer to CSS
          "sass-loader", //1. From SASS to CSS
        ],
      },
    ],
  },
});
