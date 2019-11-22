const path = require("path");
const common = require("./webpack.common");
const merge = require("webpack-merge");

module.exports = merge(common, {
  mode: "development",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", //4. Inject CSS into DOM
          "css-loader", // 3. From css to vanilla js
          {
            loader: "postcss-loader", // 2. Add Autoprefixer to CSS
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")]
            }
          },
          "sass-loader" //1. From SASS to CSS
        ]
      }
    ]
  }
});
