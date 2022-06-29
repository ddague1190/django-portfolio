const path = require("path");

module.exports = {
    entry: {
        main: "./assets/js/app.js",
        vendor: "./assets/js/vendor.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: path.resolve(__dirname, "static", "images")
                    }
                }
            }
        ]
    }
}