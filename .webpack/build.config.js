const merge = require('webpack-merge');
const common = require('./common.config.js');
const path = require('path');

module.exports = merge(common, {
    mode: "production",

    entry: path.resolve(__dirname, '../src/index.ts'),
});