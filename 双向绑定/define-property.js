/**
 * 利用Object.defineProperty 或者 Proxy生成的 Observer针对对象/对象属性进行劫持，在属性发生变化
   后通知订阅者
 * 解析器Compile解析模版中的Directive（指令），收集指令所依赖的方法和数据，等数据变化后进行渲染
 * Watcher属于Observer和Compile桥梁，它接受收到的Observer产生的数据变化并根据Compile提供的指令
   进行视图渲染
 * */

//这是将要劫持的对象
const data = {
    name:''
}
function say(name) {
    if(name === '古天乐'){
        console.log('给大家推荐一款超好玩的游戏')
    }else if(name === '渣渣辉'){
        console.log('戏我演过很多，可游戏我只玩贪玩蓝月')
    }else {
        console.log('是兄弟就来砍我')
    }
}

//遍历对象 对其属性值进行劫持
Object.keys(data).forEach(function (key) {
    Object.defineProperty(data,key,{
        enumerable:true,
        configurable:true,
        get:function () {
            console.log('get')
        },
        set:function (newVal) {
            //当属性值发生变化时进行额外操作
            console.log(`大噶号，我系${newVal}`)
            say(newVal)
        }
    })
})

data.name = '渣渣辉'
//
//数据劫持的优势，1）不需要显示调用：如Vue使用数据劫持和发布订阅直接可以通知变化并且更改视图，而react
//就需要显示调用setState
//2）可以精确的得知变化数据，劫持了属性的setter，当属性值发生变化 可以精确的获知变化内容newVal

//极简版的双向绑定： 对obj的text属性进行劫持，在获取次属性的值时打印'get val'，在更改属性值的时候对DOM进行操作
const obj = {}
Object.defineProperty(obj,'text',{
    get:function () {
        console.log('get val');&emsp;
    },
    set:function (newVal) {
        console.log('set val:' + newVal )
        document.getElementById('input').val = newVal
        document.getElementById('span').innerHTML = newVal
    }
});
const input = document.getElementById('input');
input.addEventListener('keyup',function (e) {
    obj.text = e.target.value;
})


//结合发布订阅模式
//先实现一个订阅发布中心
let uid = 0
class Dep {
    constructor() {
        //设置id 用于区分新watcher和至改变属性值后产生的Watcher
        this.id = uid++;
        //存储订阅者的数组
        this.subs = []
    }
    //触发target上的Watcher中的addDep方法，参数为dep实例本身
    depend() {
        Dep.target.addDep(this)
    }
    //添加订阅者
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        //通知所有订阅者（Watcher）,触发订阅者的相应逻辑处理
        this.subs.forEach(sub => sub.update())
    }
}
//为Dep类设置一个静态属性 默认为null
Dep.target = null

//实现监听者
class Observer {
    constructor(value) {
        this.value = value
        this.walk(value)
    }
    //遍历属性值并监听
    walk(value) {
        Object.keys(value).forEach(key => this.convert(key, value[key]))
    }
    convert(key, val) {
        defineReactive(this.value,key,val)
    }
}

function defineReactive(obj, key, val) {
    const dep = new Dep()
    let childOb = observer(val);
    Object.defineProperty(obj, key, {
        enumerable:true,
        configurable:true,
        get:() => {
            //如果Dep类有target属性 将其添加到dep实例是subs数组
            //target指向一个Watcher实例，没个Watcher都是一个订阅者
            //Watcher实例在实例化过程中，会读取data中的某个属性 从而get方法
            if(Dep.target){
                dep.depend()
            }
            return val
        },
        set: newVal => {
            if(val === newVal) return
            val = newVal
            childOb = observer(newVal)
            dep.notify()
        }
    })
}
function observer(value) {
    //当值不存在时 或者不是复杂数据类型时候 不再继续深入监听
    if(!value || typeof value !== 'object'){
        return
    }
    return new Observer(value)
}

//实现一个订阅者（Watcher）
class Watcher {
    constructor (vm, expOrFn, cb) {
        this.depIds = {} //hash储存订阅者的ID 避免重复的订阅着
        this.vm = vm;
        this.cb = cb;
        this.expOrFn = expOrFn;
        this.val = this.get()

    }
    update() {
        this.run()
    }
    addDep(dep) {
        //如果在depIds的hash中没有当前的id，就可以判断是新的Watcher
        if(!this.depIds.hasOwnProperty(dep.id)){
            dep.addSub(this);
            this.depIds[dep.id] = dep
        }
    }
    run() {
        const val = this.get();
        console.log(val)
        if(val !== this.val){
            this.val = val
            this.cb.call(this.vm, val)
        }
    }
    get() {
        //当前订阅者读取被订阅数据的最新更新后的值是  通知订阅者管理员
        Dep.taret = this;
        const val = this.vm._data[this.expOrFn];
        //置空  用于下一个Watcher
        Dep.target = null
        return val
    }
}

class Vue {
    constructo(options= {}) {
        this.$options = options;
        let data  = (this._data = this.$options.data)
        Object.keys(data).forEach(key => this._proxy(key))

        //监听数据
        observer(data)
    }
    //对外暴露调用订阅者的接口 内部主要在指令中使用订阅者
    $watch(expOrFn, cb){
        new Watcher(this, expOrFn, cb)
    }
    _proxy(key) {
        Object.defineProperty(this, key, {
            enumerable:true,
            configurable:true,
            get: () =>this._data[key],
            set: val => {
                this._data[key] = val;
            }
        })
    }
}