
var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist/static/');
var APP_DIR = path.resolve(__dirname, 'src/');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractSass = new ExtractTextPlugin({
    filename: "./style.css",
    disable: false
})

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


var config = {
    entry: ["babel-polyfill", APP_DIR + '/index.js'],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
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
                include: APP_DIR + '/index.scss',
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                })
            },
            // Fonts
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                exclude: APP_DIR + '/assets/images/',
                loader: 'url-loader?limit=100000'
            },
		],
	},
    plugins: [
        extractSass,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            comments: false,
            sourceMap: false,
            minimize: true
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new BundleAnalyzerPlugin(),
        // I don't need locale files of moment
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|fa/)
    ],
};

module.exports = config;