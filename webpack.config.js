/*
 * Copyright (c) 2025 Anthony S. All rights reserved.
 */

const path = require('path');

module.exports = {
	entry: {
		'/src/public/assets/js/app.js': [
			'./src/assets/js/app.ts',
			'./src/assets/js/declare.ts',
			'./src/assets/scss/app.scss',
		]
	},
	output: {
		filename: '[name]',
		path: path.resolve(__dirname),
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.scss$/,
				use: ['style-loader', 'css-loader', 'sass-loader'],
			},
		],
	},
	devtool: 'source-map',
};
