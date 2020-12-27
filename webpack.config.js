/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path")

const DOCS_DIR = path.resolve(__dirname, "docs")
const TSCONFIG_PATH = path.resolve(__dirname, "tsconfig.json")

module.exports = {
  entry: "./src/client.ts",

  output: {
    filename: "bundle.js",
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
}
