/**
 * Created by 17073565 on 2018/5/22.
 */
//js只有一个线程 ，事件放在任务列中，通过next 一次执行方法，
class lazyMan{
    constructor(name) {
        this.tasks = []
        const first = () =>{
            console.log('my name is '+name)
            this.next()
        }
        this.tasks.push(first);
        setTimeout(() => this.next(), 0)
    }

    next() {
        const task = this.tasks.shift();
        task && task()
    }
    eat(food) {
        const eat = () => {
            console.log('eat' + food)
            this.next()
        }
        this.tasks.push(eat)
        return this
    }
    sleep(time) {
        const newTime = time * 1000;
        const sleep = () => {
            console.log('sleep'+ time +'s!')
            setTimeout(() => {
                this.next()
            },newTime)
        }
        this.tasks.push(sleep)
        return this
    }
    sleepFirst(time){
        const newTime = time * 1000
        const sleepFirst = () => {
            console.log('sleep ' + time + 's first!')
            setTimeout(()=>{
                this.next()
            },newTime)
        }
        this.tasks.unshift(sleepFirst)
        return this
    }
}

const aLazy = new lazyMan('王小二')
aLazy.eat('苹果').eat('香蕉').sleep(5).eat('葡萄').eat('橘子').sleepFirst(2)


//对比与node 使用 use 注册中间件，use的实现
function use(fn){
    if(typeof fn !== 'function') throw new TypeError();
    if(isGeneratorFunction(fn)){  //koa2 中使用async await 替代koa1 中的generator
        depercate('Support for generators will be removed in v3.' + 'See the documentation for example of how to convert old middleware'
        + 'http://'
        );
        fn = convert(fn)
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this
}

listen(...args) {
    debug('listen')
    const server = http.createServer(this.callback())
    return server.listen(...args)
}

//启动server,原生启动server，原生的回调函数接受两个参数，request response
https.createServer(options, function (req,res) {
    res.writeHead(200)
    res.end('hello world')
}).listen(3000)

//在koa2 中回调函数的代码
callback() {
    const fn = compose(this.middleware);

    if(!this.listeners('error').length) this.on('error',this.error)

    const handleRequest = (request) => {
        res.statusCode = 404;
        const ctx = this.createContext(req,res)
        const onerror = err => ctx.onerror(err);
        const handleResponse = () => respond(ctx)
        onFinish(res, onerror);
        return fn(ctx).then(handleResponse).catch(onerror)
    }
    return handleRequest()
}

//compose 将多个中间件组合起来
function compose(middleware) {
    if(!Array.isArray(middleware)) throw new TypeError ('Middleware stack must be wan array')
    for(const fn of middleware){
        if( typeof fn !== 'function') throw new TypeError('Middleware must be composed of function')
    }
    return function (context, next) {
        let index = -1;
        return dispatch(0)
        function dispatch(i) {
            if(i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if(i === middleware.length) fn = next
            if(!fn) return Promise.resolve()
            try{
               return Promise.resolve(fn(context, function next() {
                   return dispatch(i +1)
               }))
            }catch (err){
                return Promise.reject(err)
            }
        }
    }
}
//compose(this.middleware)(ctx) 默认会执行中间件数组中的第一个
//也就是代码中的 dispatch(0) 第一个中间件通过await next() 返回的是第二中间件的执行
//2：然后第二个中间件执行await next() 然后返回第三个。。。
//3：中间件处理结束后 剩下的就是通过中间件中不断传递的context来对请求做处理