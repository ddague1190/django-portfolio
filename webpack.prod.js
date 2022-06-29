const path = require("path");
const common = require("./webpack.common")
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleTracker = require('webpack-bundle-tracker');

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "[name].[contenthash].bundle.js",
        path: path.resolve(__dirname, "assets", "webpack_bundles"),
        publicPath: "/static/bundles/"
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
        new CleanWebpackPlugin(),
        new BundleTracker({ filename: './webpack-stats.json' })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            }
        ]
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin()
        ],
    },
});