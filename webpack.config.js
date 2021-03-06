/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path")

const DOCS_DIR = path.resolve(__dirname, "docs")
const SRC_DIR = path.resolve(__dirname, "src")
const TSCONFIG_PATH = path.resolve(__dirname, "tsconfig.json")

module.exports = {
  entry: {
    bundle: "./src/regular.ts",
    "concurrent/bundle": "./src/concurrent.ts",
  },

  output: {
    filename: "[name].js",
    path: DOCS_DIR,
  },

  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".js",
    ],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: TSCONFIG_PATH,
        },
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },

  // webpack serve
  devServer: {
    contentBase: [
      DOCS_DIR,
      SRC_DIR,
    ],
    hot: false,
    liveReload: true,
    watchContentBase: true,
  },
}
