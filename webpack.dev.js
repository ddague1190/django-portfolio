const path = require("path");
const common = require("./webpack.common")
const { merge } = require("webpack-merge");
const Webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleTracker = require('webpack-bundle-tracker');


module.exports = merge(common, {
    target: 'web',
    mode: "development",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "assets", "webpack_bundles"),
        publicPath: '/static/'
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new MiniCssExtractPlugin({ filename: "[name].bundle.css" }),
        new CleanWebpackPlugin(),
        new BundleTracker({ filename: './webpack-stats.json' })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        hot: true,
        port: 9091,
        headers: {
            "Access-Control-Allow-Origin": "*",
          }
    },
});