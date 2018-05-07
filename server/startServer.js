import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevMiddleware from 'webpack-dev-middleware';
import open from 'open';
import config from '../webpack.config.dev';


const port = 3000;
const compiler = webpack(config);
const app = express();

app.use(webpackDevMiddleware(compiler, {
	noInfo: true,
	publicPath: config.output.publicPath
}));

app.use(webpackHotMiddleware(compiler));

// Route Method
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, (err) => {
	err ? console.log(err) : open('http://localhost:3000')
})