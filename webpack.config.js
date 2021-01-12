const path = require('path') 
const HtmlWebpackPlugin = require('html-webpack-plugin') 
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

module.exports = { 
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: ASSET_PATH
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        index: 'index.html',
        contentBase: path.join(__dirname, './dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            { 
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i, 
                type: 'asset/resource'
            },
            { 
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, 
                type: 'asset/inline', 
            },
            { 
                test: /\.(scss|css)$/, 
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'], 
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: ['babel-loader'], 
            }
        ]
    },
    plugins: [ 
        new HtmlWebpackPlugin({ 
            title: 'KMei App', 
            template: path.resolve(__dirname, 'index.html'), // template file 
            filename: 'index.html', // output file 
        }), 
        new CleanWebpackPlugin()
    ]
} 