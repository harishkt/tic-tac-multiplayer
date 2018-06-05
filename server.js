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
// const HTML_FILE = path.join(DIST_DIR, 'index.html');
const isDevelopment = process.env.NODE_ENV !== 'production';
const DEFAULT_PORT = 3000;
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
		res.sendFile(path.join(__dirname, './src/index.html'));
	});
	
} else {
	app.use(express.static(DIST_DIR));
	app.get('*', (req, res) => res.sendFile('./index.html'));
}
app.listen(process.env.PORT || 3000, () => {
	console.log(`Server listening on port - ${process.env.PORT || 3000}`);
});

