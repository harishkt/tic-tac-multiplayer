const path = require('path');
const webpack = require('webpack');

module.exports =  {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.resolve(__dirname, 'src')
	},
	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.resolve(__dirname, 'src/index')
	],
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname) + '/dist',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
				exclude: [/node_modules/]},
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
		new webpack.HotModuleReplacementPlugin(),
		new webpack.LoaderOptionsPlugin({
			debug: true
		})
	],
	target: 'web'
};
