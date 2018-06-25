/**
 * Created by 17073565 on 2018/5/9.
 */
const path = require('path')
const ExtractPlugin = require('extract-text-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const VueServerPlugin = require('vue-server-renderer/server-plugin')

let config
config = merge(baseConfig, {
    target: 'node',
    entry: path.join(__dirname, '../client/server-entry.js'),
    devtool: 'source-map',
    output: {
        libraryTarget: 'commonjs2',
        filename: 'server-entry.js',
        path: path.resolve(__dirname, '../server-build')
    },
    externals: Object.keys (require('../package.json').dependencies),
    module: {
        rules: [
            {
                test: /\.styl/,
                use: ExtractPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractPlugin('styles.[contentHash:8].css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueServerPlugin()
    ]
})
module.exports = config