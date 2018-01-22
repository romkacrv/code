const merge = require('webpack-merge');
const configCommon = require('./webpack.config.common.js');
const webpack = require('webpack')

module.exports = merge(configCommon, {
    devtool: 'eval-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: true,
                warnings: false
            },
            mangle: {
                except: ['$super', '$', 'exports', 'require']
            },
            output: {
                comments: false
            },
            sourceMap: true
        })
    ]
});