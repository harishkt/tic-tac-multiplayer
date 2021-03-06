const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const open = require('open');
const config = require('./webpack.config.dev');
const http = require('http');



const app = express();
const DIST_DIR = path.join(__dirname, 'dist');
const HTML_FILE = path.join(__dirname, 'index.html');
const isDevelopment = process.env.NODE_ENV !== 'production';
console.log(`isDevelopment is ${isDevelopment}`);
const DEFAULT_PORT = 8080;
const compiler = webpack(config);

app.set("port", process.env.port || DEFAULT_PORT );

if (isDevelopment) {
	app.use(webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: config.output.publicPath
	}));
	app.use(webpackHotMiddleware(compiler));
	// Route Method
	app.get('*', (req, res) => {
		console.log(HTML_FILE);
		res.sendFile(HTML_FILE);
	});
	
} else {
	console.log('entered else block');
	app.use(express.static(DIST_DIR));
	app.get('*', (req, res) => res.sendFile(HTML_FILE));
}
app.listen(process.env.PORT || 8080, () => {
	console.log(`Server listening on port - ${process.env.PORT || 8080}`);
});

