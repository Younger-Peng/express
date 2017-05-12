var webpack = require('webpack');

var path = require('path');

module.exports = {
	entry: path.join(__dirname,'js/app/index.js'),
	output: {
		path: path.join(__dirname,'../public/js'),
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ['style-loader','css-loader','less-loader']
			},
			// {
			// 	test: /\.jpg$/,
			// 	use: ['url-loader?limit=10000'!./]
			// }
		]
	},
	resolve: {
		alias: {
			// jquery: path.joiin(__dirname,'js/lib/jquery-2.0.3.min.js'),
			// modules: path.join(__dirname,'js/modules'),
			less: path.join(__dirname,'less') //注意：这的less并没有指向具体的toast.less文件，而是指向一目录，具体的路径可以在toast.js中，require('less/toast.less')即可，因为当碰到less，就会把它换成绝对路径
		}
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false,
		// 	},
		// 	output: {
		// 		comments: false,
		// 	},
		// })
	]
}

