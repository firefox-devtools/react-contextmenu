/* eslint-disable */

const webpack = require('webpack');
const path  = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PROD = process.env.NODE_ENV === 'production';
const DEV = !PROD;

const config = {
    mode: PROD ? "production" : "development",
    entry: ['./examples/index.js'],
    output: {
        filename: 'bundle.[contenthash].js',
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
                use: [
                    DEV ? "style-loader": MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: DEV ? 'styles.css' : 'styles.[contenthash:6].css',
        }),
        new HtmlWebpackPlugin({
            template: 'examples/index.html',
            inject: true,
            filename: 'index.html'
        })
    ]
};

!PROD && (config.devtool = 'source-map');

module.exports = config;
