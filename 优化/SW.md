##Service Worker
有以下特性和功能
1. 一个独立的worker线程，独立于当前网页进程
2. 一旦被install，就永久存在，除非被uninstall
3. 需要的时候自动唤醒，不需要是时候自动睡眠
4. 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网页离线状态）
5. 离线内容开发者可控
6. 能想客户端推送信息
7. 不能直接操作DOM
8. 处于安全考虑，必须在HTTPS环境下才能工作

###工作原理
Service Worker的技术核心是Service Worker脚本，它是一种由JS编写的浏览器端代理脚本

前端页面向内核发起注册时会将脚本地址通知内核，内核会启动独立进/线程加载SW脚本并执行Service Worker
的安装及激活动作。成功激活后便进入空闲等待状态，若当前的SW 进/线程一直没有管辖的页面
或者事件消息时会自动终止，当打开新的可管辖的页面或者已管辖页面发起message等消息时，SW
进/线程会被重新唤起
当已安装的SW有管辖页面被打开时，便会触发SW脚本更新，当SW脚本发生了更改，便会忽略本地网络
cache的SW脚本 直接从网络拉取。

###实例代码
```javascript
if(naviagtor.serviceWorker !== null){
    navigator.serviceWorker.register('sw.js')
    .then(function(registration){
        console.log('Registered events at scope', registration.scope)
    })
}
```

```javascript
//首先定义需要缓存的路径，以及需要缓存的静态文件的列表
var cacheStorageKey = 'minimal-pwa-8'
var cacheList = [
    '/',
    'index.html',
    'main.css',
    'e.png',
    '*.png'
]

//借助SW 可以在注册完成安装SW时，抓取资源写入缓存
window.addEventListener('install',function(e){
    e.waitUntil(
        caches.open(cacheStorageKey).then(function(cache){
            console.log('Adding to Cache',cacheList)
            return cache.addAll(cacheList)
        }).then(function(){
            console.log('Skip waiting')
            return self.skipWaiting()
        })
    )
})

//网页抓取资源的过程中，在SW可以捕获到fetch事件，可以编写代码决定如何响应资源请求
window.addEventListener('fetch',function(e){
    e.respondWith(
        caches.match(e.request).then(function(response){
            if(response !== null){
                console.log('Using cache for:', e.request.url)
                return response
            }
            console.log('Fallback to fetch', e.request.url)
            return fetch(e.request.url)
        })
    )
})
```


