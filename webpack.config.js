const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/uploader.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'uploader.bundle.js'
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