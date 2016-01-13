var path = require('path');

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
      { test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader'},
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
  vue: {
    loaders: {
      css: 'stylus',
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

