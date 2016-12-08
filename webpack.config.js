var path = require('path');
var webpack = require('webpack');

var cssIdentifier = '[path][name]---[local]';
var cssLoader = ['style-loader', 'css-loader?localIdentName=' + cssIdentifier];

module.exports = {
  //entry point - first for app, other for HotModuleReplacementPlugin
  entry: [
            './src/index.js',
            'webpack/hot/dev-server',
  			    'webpack-dev-server/client?http://localhost:8082'
          ],
  plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.UglifyJsPlugin({
              comments: true,
              mangle: false,
              compress: {
                warnings: true
              }
            })
  ],

  //simple loaders. 1) babel for transplaling, img for ex. with url-loader and css for ex. work with styles
  module: {
		loaders: [
      {
  			test: /\.js$/,
  			loaders: ['babel-loader'],
  			exclude: /node_modules/
		  },
      {
  			test: /\.(png|jpg|gif)$/,
  			loaders: ['url-loader?limit=10000&name=images/[hash:12].[ext]'],
  			exclude: /node_modules/
		  },
      {
  			test: /\.css$/,
  			loaders: cssLoader,
  			exclude: /node_modules/
		  }
    ]
	},
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: 'bundle.js'
  }
}
