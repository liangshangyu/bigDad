/**
 * Created by 17073565 on 2018/5/9.
 */
const path = require('path')
const createVueLoaderOptions = require('./vue-loader.config')
const isDev = process.env.NODE_ENV === 'development'
const config = {
    target: 'web',
    entry: path.join(__dirname, '../client/index.js'),
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.resolve(__dirname,'dist')
    },
    module: {
        rules: [
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            name: ''
                        }
                    }
                ]
            }
        ]
    }
}

module.exports = config