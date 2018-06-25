/**
 * Created by 17073565 on 2018/5/9.
 */
const baseConfug = require('./webpack.config.base')
const path = require('path')
const HtmlWabpackPlugin  = require('html-webpack-plugin')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ExtractPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const defaultPlugins = [
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"': '"production"'
        }
    }) ,
    new HtmlWabpackPlugin()
]
const devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
        errors: true
    },
    hot: true
}

let config

if(isDev) {
    //开发环境的配置
    config = merge(baseConfug,{
        devtool: '#cheap-module-eval-source-map',
        module: {
            rules: [
                {
                    test: /\.styl/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                }
            ]
        },
        devServer,
        plugins: defaultPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        ])
    })
}else {
    //正式环境的配置
    config = {
        entry: {
            app: path.join(__dirname, '../client/index.js'),
            vendor: ['vue']
        },
        output: {
            filename: '[name].[chunkhash:8].js'
        },
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
        plugins: defaultPlugins.concat([
            new ExtractPlugin('styles.[contentHash:8].css'),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'runtime'
            })
        ])
    }
}
module.exports = config