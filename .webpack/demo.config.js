const merge = require('webpack-merge');
const common = require('./common.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    entry: path.resolve(__dirname, '../src/demo.tsx'),

    devtool: 'eval',

    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin(),
    ],

    devServer: {
        host: '0.0.0.0',
        port: '8081',
    }
});
