const path = require('path')
const merge = require('webpack-merge');
const configCommon = require('./webpack.config.common.js');

module.exports = merge(configCommon, {
    devtool: 'eval',
    devServer: {
        hot: false,
        inline: true,
        contentBase: path.join(__dirname, 'dist'),
        port: process.env.PORT
    }
});