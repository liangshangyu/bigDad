/**
 * Created by 17073565 on 2018/5/2.
 */
module.exports = {
    entry: '',      //入口文件
    output: {},     //出口文件
    module: {},     //处理对应模块
    plugins: [],    //对应的插件
    devServer: {},  //开发服务器配置
    mode: 'development' //模式配置
}


const path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        filename:'bundle.js',
        path: path.resolve('dist')
    }
}
/**
 * 以上是最简单配置 一般通过npm run dev 开发环境下的打包文件 由于devServer帮我们把文件放到内存中 所以不会输出dist
 * 或者npm run build  生产环境 上线需要的
 * */

/*多个入口*/
module.exports = {
    //1.写成数组的形式就可以打出多个入口文件 不过这里打包后的文件都合成了一个
    //entry: ['','']
    //2: 真正实现多入口和多出口需要写成对象形式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        //1、filename：'bundle.js'
        //2、[name]就可以将出口文件和入口文件名一一对应
        filename: '[name].js',  //打包后会生成index.js 和login.js两个文件
        path: path.resolve('dist')
    }
}
//这时候执行npm run build 后会生成打包好 的两个js文件
//文件打包好了 但是在使用的时候不能在dist目录下创建一个html 然后去引用打包后的js吧
//可以通过一个模版实现打包出引用好路径的html来
//用到一个插件  html-webpack-plugin
let HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        //添加hash防止文件缓存
        filename:'bundle.[hash:4].js',
        path: path.resolve('dist')
    },
    plugins: [
        //通过new一哈这个类使用
        new HtmlWebpackPlugin({
            //用哪个html模版
            //在src目录下创建一个index.html页面当作模版来用
            template: './src/index.html',
            hash: true  //会在打包好的bundle.js后面加上hash串
        })
    ]
}

/**
 * 多页面开发的配置
* */
module.exports = {
    entry: {
        index:'./src/index.js',
        login:'./src/login.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index']  //对应关系 index.js 对应的是index.html
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename:'login.html',
            chunks:['login']
        })

    ],
    module: {
        rules: [
            {test: /\.css$/,use:['style-loader','css-loader']}  //从右向左解析
        ]
    }
}
//以上经过build后会生成 index.js index.html  login.js login.html

//处理css 可以在index.js中引入css文件  直接打包到目录下
//需要安装css-loader style-loader less-loader
//这种打包后的css是以行内样式在html页面中的 如果要想link方式 就需要把css拆出来

/**
 * extract-text-webpack-plugin 插件的功效就在于会将打包到js里的css文件进行一个拆分
 * npm i extract-text-webpack-plugin@next -D
 * @next表示可以支持webpack版本4的插件
 * */
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    output: {
        filename:'bundle.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    //将css用link的方式引入就不需要style-loader
                    use:'css-loader'
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        //拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/style.css')
    ]
}
//拆分多个css
let styleLess = new ExtractTextWebpackPlugin('css/style.css')
let resetCss = new ExtractTextWebpackPlugin('css/reset.css')
module.exports = {
    module: {
        rules: [
            {
                test:/\.css$/,
                use:resetCss.extract({use:'css-loader'})
            },{
            test:/\.less$/,
                use:styleLess.extract({use:'css-loader'})
            }
        ]
    },
    plugins: [
        styleLess,
        resetCss
    ]
}
//这样操作后就可以打包生成两个不同的css文件 dist/css.style.css 和 dist/css/reset.css

/**
 * 处理图片的loader
 * 如果在css文件中引入的背景图片之类的图片 需要指定相对路径
 * */
module.exports = {
    module: {
        rules: [
            {
                test:/\.css$/,
                use:ExtractTextWebpackPlugin.extract({
                    use:'css-loader',public:'../'  //指定了相对路径就可以根据相对路径引用到图片 '../images/'
                })
            },
            {test:/\.(jpe?g|png|gif)$/,use:[
                {
                    loader:'url-loader',
                    options: {
                        limit:8192,     //小于8K的图片自动转换成base64，并且不会灿在图片实体
                        outPath:'images' //图片打包后的存放目录
                    }
                }
            ]}
        ]
    }
}

//页面中img引入图片  用到html-withimg-loader  这样打包后的html文件下的img就可以正常引用图片路径了
module.exports = {
    module: {
        rules: [
            {test:/\.(htm|html)$/,use:'html-withimg-loader'}
        ]
    }
}

/**
 * 引用字体图片个svg图片
 * 可以通过file-loader来解析
 * 这样即使样式中引入了这类格式的图标或者图片都没有问题了，img如果也引用svg格式的话，配合上面写好的html-withimg-loader就都没有问题了
 * */
module.exports = {
    module: {
        rules: [
            {
                test:/\.(eot|ttf|woff|svg)$/,
                use:'file-loader'
            }
        ]
    }
}

/**
 * 添加css3前缀 postcss中的autoprefixer可以实现将css3中的一些需要前缀的
 * 通过postcss-loader npm i postcss-loader autoprefixer -D
 * 安装后我们还需要像webpack一样写一个config文件 在项目的根目录下创建postcss.config.js
 * 然后配置postcss-loader
 * */
module.exports = {
    module: {
        rules: [
            {test:/\.css$/,use:['style-loader','css-loader','postcss-loader']}
        ]
    }
}

/**
 * 转移es6
 * babel-core babel-loader babel-preset-env babel-preset-stage-0 -D
 * 首先配置.babelrc文件
 * */
module.exports = {
    module: {
        rules: [
            {
                test:/\.js$/,
                use:'babel-loader',
                include:/src/,          //只转化src目录下js
                exclude: /node_modules/  //排除掉node_modules 优化打包速度
            }
        ]
    }
}

//tips：应该在每次打包之前将dist目录下的文件都清空，然后再把打好包的文件放进去
// clean-webpack-plugin
let CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    module:{
        rules: [
            {}
        ]
    },
    plugins: [
        //打包前清空
        new CleanWebpackPlugin('dist')
    ]
};

/**
 * 启动静态服务器： 启动一个静态服务器 默认会自动刷新 也就是说你对js/css/hrml文件做了修改
 * 浏览器就会默认刷新展示修改后的结果
 *
 * 执行npm run dev 就会打开静态服务器
 * */
let webpack = require('webpack')
module.exports = {
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        host: 'localhost',          //默认是localhost
        port: 3000,                 //端口
        open: true,                 //自动打开浏览器
        hot: true                   //开启热更新
    }
}

//此时并虽然配置了插件和开启了热更新 但是实际不会生效
//index.js
let a = 'hello world'
document.body.innerHTML = a

//还需要在主要但是js文件里写下这段代码
if(module.hot){
    module.hot.accept()
}

/**
 * resolve配置别名和省略后缀名
 * */
module.exports = {
    resolve: {
        alias: {
            $:'./src/jquery.js'
        },
        extensions:['./js','.json',',css']
    }
}

/**
 * 提取公共代码
 * 在webpack4 之前使用 CommonChunkPlugin的插件，但是webpack4内置了
 * */
//假设a.js 和b.js都同时引入了jquery.js 和一个写好的utils.js
import $ from 'jquery'
import {sum} from 'utils'
//那么他们两个js中其中公共的代码就是jqeury和utils李的代码
module.exports = {
    entry: {
        a:'./src/a.js',
        b: './src/b.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dist')
    },
    //提取公共代码
    optimization: {
        splitChunks: {
            vendor: {               //抽离第三方插件
                test: /node_modules/,  //指定node_modules下的第三方插件
                chunks: 'initial',
                name: 'vendor',         //打包后的文件名 可任意命名
                //设置优先级 发那个只和自定义的公共代码提取是被覆盖，不进行打包
                priority:10
            },
            utils: {        //抽离自己写的公共代码 utils这个名字可以随意起
                chunks: 'initial',
                name: 'utils',    //任意命名
                minSize: 0        //只要超出0字节就生成一个新的包
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'a.html',
            template:'./src/index.html',
            chunks: ['vendor','a']
        }),
        new HtmlWebpackPlugin({
            filename: 'b.html',
            template: './src/b.html',
            chunks: ['vendor', 'b']
        })
    ]
}