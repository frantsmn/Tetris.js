const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: __dirname + '/src/index.js',
	output: {
		filename: '[name].js',
		path: __dirname + '/dist'
	},

	watch: true,
	mode: 'development',
	devtool: false,

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
					{ loader: 'css-loader', options: { url: false, sourceMap: false } },
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
			template: __dirname + '/src/index.html'
		}),
		new CopyPlugin({
			patterns: [
				{ from: "src/assets", to: "assets" },
				{ from: "src/favicon.ico", to: "favicon.ico" },
			],
		}),
	],

	devServer: {
		contentBase: __dirname + '/dist',
		open: true,
		port: 8080,
		hot: true
	}
};