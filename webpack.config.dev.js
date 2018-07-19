
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'wpdev');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
    entry: APP_DIR + '/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: BUILD_DIR,
        compress: true,
        port: 4444,
        host: '0.0.0.0',
        historyApiFallback: true
    },
    module: {
		rules: [
			// Transform all ES6 files to plain old ES5.
			{
				test: /\.(js|jsx)$/,
				exclude: [/node_modules/, /build/],
				loader: 'babel-loader',
                include: APP_DIR,
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', "stage-0", 'react']
                }
			},
			{
				test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader',
                          'resolve-url-loader?sourceMap',
                          'sass-loader?sourceMap'],
                exclude: [/node_modules/, /build/],
                include: APP_DIR,
            },
            // Fonts
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                exclude: APP_DIR + '/assets/images/',
                loader: 'url-loader?limit=100000'
            }
		],
    }
};

module.exports = config;
