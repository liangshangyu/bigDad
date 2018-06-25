/**
 * Created by 17073565 on 2018/5/9.
 */
const Koa = require('koa')
const path = require('path')
const axios = require('axios')
const app = new Koa()
const isDev = process.env.NODE_ENV === 'development'
const router = require('koa-router')
const fs = require('fs')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const VueServerRendere = require('vue-server-renderer')

const serverConfig = require('../build/webpack.config.server')

//如何能在node开发环境中让webpack跑起来呢？ 答案是通过serverCompiler
const serverCompiler = webpack(serverConfig)

//创建一个mfs实例，并且指定webpack输出目录在MemoryFS里面
const mfs = new MemoryFs()
serverCompiler.outputFileSystem = mfs

//声明 bundle 用来记录webpack每次打包生成的新文件
//使用 watch 在client目录下每修改一次文件 就会重新执行一次打包 然后就可以拿到新的文件
let bundle
serverCompiler.watch({}, (err, stats) => {
    if(err) throw err
    stats = stats.toJSON()
    stats.error.forEach(err => console.log(err))
    stats.hasWarning.forEach(warn => console.warn(err))

    const bundlePath = path.join(
        serverConfig.output.path,
        'vue-ssr-server-bundle.json'
    )
    bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
})

const handleSSR = async (ctx) => {
    if(bundle) {
        ctx.body = 'await a moment...'
        return
    }

    const clientManifestResp = await axios.get(
        'http://127.0.0.1:8080/vue-ssr-client-manifest.json'
    )

    const clientManifest = clientManifestResp.data

    const template = fs.readFileSync(
        path.join(__dirname, '../server.template.ejs')
    )

    const renderer = VueServerRendere.createBundleRenderer(bundle, {
        inject: false,
        clientManifest
    })
}