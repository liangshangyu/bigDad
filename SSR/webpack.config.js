/**
 * Created by 17073565 on 2018/5/9.
 */
const path = require('path')
const vueLoaderConfig = require('./vue-loader.conf.js')
module.exports = {
    //__dirname就代表这个文件所在的目录地址
    //path.join()的意思就是和后面的字符串路径拼接起来，形成一个绝对的路径。
    entry: path.join(__dirname,'src/index.js'),
    output: {
        filename:'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module:{
        rules: [
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options: vueLoaderConfig
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            }
        ]
    }
}