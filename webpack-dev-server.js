// var config = require("./webpack.config.js");
// var webpack = require("webpack");
// var webpackDevServer = require("webpack-dev-server");
// config.entry.unshift("webpack-dev-server/client?http://localhost:8080");
// var compiler = webpack(config);
// var server = new webpackDevServer(compiler, {
//   contentBase: "./",
//   // or: contentBase: "http://localhost/",
//   hot: true,
//   historyApiFallback: true,
//   quiet: false,
//   noInfo: false,
//   lazy: true,
//   // proxy: {
//   //   "*": "http://ilm.dev/"
//   // },
//   filename: "bundle.js",
//   watchOptions: {
//     aggregateTimeout: 300,
//     poll: 1000
//   },
//   stats: { colors: true },
// });
// server.listen(8080);

module.exports = {
  contentBase: "./",
  // or: contentBase: "http://localhost/",
  // hot: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  lazy: true,
  devServer: {
    proxy: {
      "/head/": {target: "http://ilm.dev/head/"},
    },
  },
  filename: "bundle.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  stats: { colors: true },
};