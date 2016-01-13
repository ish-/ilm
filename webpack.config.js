var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: './dist/bundle.js'
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue'},
      { test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel-loader' },
      // { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
      { test: /\.styl$/, loader: ExtractTextPlugin.extract("css!stylus")},
      { test: /\.jade$/, loader: "jade" },
    ]
  },
  babel: {
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-runtime'],
  },
  // resolve: {
  //     extensions: ['es6']
  // }
  plugins: [
    new ExtractTextPlugin("./dist/bundle.css"),
  ],
  vue: {
    loaders: {
      css: ExtractTextPlugin.extract("css"),
      stylus: ExtractTextPlugin.extract("css!stylus"),
      // css: 'stylus',
      html: 'jade',
      js: 'babel',
    },
  },
  stylus: {
      use: [require('nib')()],
      import: ['~nib/lib/nib/index.styl'],
      // import: ['~nib/lib/nib/index.styl']
  }
};

