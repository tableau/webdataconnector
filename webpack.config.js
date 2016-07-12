var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: [path.resolve("./Simulator/components/App")],

    output: {
        path: path.resolve(__dirname, "Simulator"),
        filename: "wdc-simulator.js"
    },

    devtool: 'eval',

    module: {
        loaders: [
            {
                test: [/\.js$/, /\.jsx$/],
                include: [
                  path.resolve(__dirname, "Simulator/components"),
                  path.resolve(__dirname, "Simulator/utils"),
                  path.resolve(__dirname, "Simulator/actions"),
                  path.resolve(__dirname, "Simulator/reducers"),
                  path.resolve(__dirname, "Simulator/store")
                ],
                loader: 'babel-loader'
            }
        ]
    },

    resolve: {
        root: path.join(__dirname),
        modulesDirectories: [
            'node_modules',
            'Simulator/components',
            'Simulator/reducers',
            'Simulator/store',
            'Simulator/utils'
        ],
        extensions: ['', '.js', '.jsx']
    }
}
