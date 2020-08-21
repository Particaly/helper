'use strict'
const path = require('path')

module.exports = {
	context: path.resolve(__dirname, './'),
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@c': path.resolve(__dirname, './src/components'),
			'@cp':path.resolve(__dirname, './src/components/pages'),
			'@cc': path.resolve(__dirname, './src/components/common'),
			'@image': path.resolve(__dirname, './src/assets/common/images'),
			'@cjs': path.resolve(__dirname, './src/assets/common/js'),
			'vue$':'vue/dist/vue.runtime.esm.js'
		},
	},
}
