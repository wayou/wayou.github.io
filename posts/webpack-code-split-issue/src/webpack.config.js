const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = {
  entry: {
    a: "./a.js",
    b: "./b.js"
  },
  output: {
    filename: "[name].bundle.js"
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "all",
          minSize:0,
          test: /[\\/]node_modules[\\/]/
        }
      }
    }
  },
  plugins: [new BundleAnalyzerPlugin()]
};
