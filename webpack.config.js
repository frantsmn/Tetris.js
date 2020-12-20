const HtmlWebpackPlugin = require('html-webpack-plugin');

const CopyPlugin = require("copy-webpack-plugin");
// const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: __dirname + '/src/index.js',
	output: {
		filename: '[name].js',
		path: __dirname + '/dist'
	},
	cache: true, watch: true,

	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
				options: {
					// Disables attributes processing
					attributes: false,
				},
			},
			{
				test: /\.s?css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{ loader: 'css-loader', options: { url: false, sourceMap: true } },
					"sass-loader"
				]
			}
		]
	},

	plugins: [
		new MiniCssExtractPlugin({
			filename: "css/[name].css",
			chunkFilename: "[id].css"
		}),
		new HtmlWebpackPlugin({
			// title: 'Custom template',
			// Load a custom template (lodash by default)
			template: __dirname + '/src/index.html'
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/assets", to: "assets" },
				// { from: "src/index.html", to: "index.html" },
				{ from: "src/favicon.ico", to: "favicon.ico" },
			],
		}),
	],

	devServer: {
		contentBase: __dirname + '/dist',
		open: true,
		compress: true,
		port: 8080,
		hot: true
	}
};