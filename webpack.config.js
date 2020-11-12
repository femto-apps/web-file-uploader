const path = require('path')

module.exports = {
    mode: 'production',
    entry: {
        uploader: './src/uploader.js',
        stats: './src/stats.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
}