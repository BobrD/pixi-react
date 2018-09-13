const path = require('path');

module.exports = {
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'build.js',
    },

    plugins: [],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
                exclude: [/node_modules/]
            },
        ]
    },

    node: {
        net: 'empty',
        fs: 'empty'
    },
};