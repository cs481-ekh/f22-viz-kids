const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	output: {
		filename: "[contenthash].js",
		clean: true,
	},
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Movilo",
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.(png|jpe?g)$/i,
				type: "asset/resource"
			}
		]
	}
};
