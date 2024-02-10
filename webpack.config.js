const path = require("path");

const isProductionMode = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.ts",
  target: 'node',
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/", "/dist/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
};
module.exports = () => {
  if (isProductionMode) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
