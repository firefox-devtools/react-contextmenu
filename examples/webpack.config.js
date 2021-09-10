/* eslint-disable */

const webpack = require('webpack');
const path  = require('path');
const Extract = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

const PROD = process.env.NODE_ENV === 'production';
const DEV = !PROD;

const config = {
    entry: ['./examples/index.js'],
    output: {
        filename: DEV ? 'bundle.js' : 'bundle.[hash].js',
        path: path.resolve(__dirname, '../public'),
        publicPath: DEV ? '/' : '/react-contextmenu/',
        hashDigestLength: 6,
        sourceMapFilename: 'bundle.js.map'
    },
    resolve: {
        modules: [
            path.resolve(__dirname, '../'),
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        assumptions: {
                            setPublicClassFields: true
                        },
                        presets: [
                            '@babel/preset-react',
                            ['@babel/preset-env', {
                                modules: false,
                                targets: "defaults",
                            }]
                        ],
                    }
                }],
                include: [
                    path.resolve(__dirname, '../src'),
                    path.resolve(__dirname)
                ]
            },
            {
                test: /\.css$/,
                use: Extract.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader'
                    }]
                }),
            }
        ]
    },
    plugins: [
        new Extract({
            filename: DEV ? 'styles.css' : 'styles.[contenthash:6].css',
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            template: 'examples/index.html',
            inject: true,
            filename: 'index.html'
        })
    ]
};

!PROD && (config.devtool = 'source-map');

PROD && config.plugins.push(
     new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false,
        }
    })
);

PROD && config.plugins.push(
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
    }),
    new MinifyPlugin()
);

module.exports = config;
