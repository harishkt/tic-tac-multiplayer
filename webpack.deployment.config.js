const path = require('path');
const webpack = require('webpack');

module.exports =  {
	devtool: 'source-map',
	entry: [
		path.resolve(__dirname, 'src/index')
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname) + '/dist',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{test: /\.(js|jsx)$/, use: 'babel-loader', exclude: [/node_modules/]},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compress: {
				warnings: false
			}
		})
	],
	target: 'web'
}