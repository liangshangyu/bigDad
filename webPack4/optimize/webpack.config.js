/**
 * Created by 17073565 on 2018/5/14.
 */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name][hash:8].js'
    },
    module: {
        rules: [
            {
                test:/\.jsx?/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                use: 'babel-loader'
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'less-loader'
                    ]
                })
            },
            {
                test:/\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: { //压缩jpeg的配置
                                progressive: true,
                                quality: 65
                            },
                            optipng: { //使用image-optipng压缩png， enable：false 为关闭
                                enabled: false
                            },
                            pngquant: { //
                                quality: '65-99',
                                speed: 4
                            },
                            gifsicle: { // 压缩gif
                                interlaced: false
                            },
                            webp: { //开启webp 会把jpg和png 图片压缩为webp格式
                                quality: 75
                            }
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    test: path.resolve(__dirname,'node_modules'), //路径在node_modules下的都作为公共部分
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            minify: {
                minifyCSS: true,
                minifyJS: true,
                removeComments: true
            }
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true
    }
}