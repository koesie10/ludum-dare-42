const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpackMerge = require("webpack-merge");

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({mode, presets} = {mode: "production", presets: []}) => {
    return webpackMerge({
            entry: './src/index.ts',
            mode,
            devtool: 'source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: ["source-map-loader"],
                        exclude: [
                            path.resolve(__dirname, 'node_modules/excalibur')
                        ],
                        enforce: "pre",
                    },
                    {
                        test: /\.ts?$/,
                        use: 'ts-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.(png|jpg|bmp|mp3|wav)$/,
                        use: [{
                            loader: 'file-loader',
                            options: {
                                emitFile: true
                            }
                        }]
                    }
                ]
            },
            resolve: {
                extensions: ['.tsx', '.ts', '.js'],
                alias: {
                    actors: path.join(__dirname, 'src', 'actors'),
                    scenes: path.join(__dirname, 'src', 'scenes'),
                    '@': path.join(__dirname, 'src')
                }
            },
            output: {
                filename: '[name].js',
                sourceMapFilename: '[file].map',
                path: path.resolve(__dirname, 'dist'),
            },
            optimization: {
                splitChunks: {
                    chunks: 'all'
                }
            },
            plugins: [
                new CleanWebpackPlugin(['dist']),
                new HtmlWebPackPlugin({
                    title: 'Ludum Dare 42'
                })
            ]
        },
        modeConfig(mode)
    );
};
