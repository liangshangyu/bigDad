##vue变化侦测
###如何侦测变化
js有两种方法侦测变化，Object.defineProperty和ES6的proxy
知道了Object.defineProperty可以侦测对象的变化
```javascript
function defineReactive(data,key,val) {
  Object.defineProperty(data,key,{
      enumerable:true,
      configurable:true,
      get:function() {
        return val
      },
      set:function(newVal) {
        if(val === newVal){
            return
        }
        val = newVal
      }
  })
}
```
然鹅，并没有什么鸟用，该怎么观察呢？
###怎么观察
之所以要观察一个数据，是为了当数据的属性
发生变化时，可以通知那些使用了这个key的地方
```javascript
<template>
    <div>{{key}}</div>
    <p>{{key}}</p>
</template>
```
模板两处都使用了key，所以当数据发生变化时候，这两处
要通知到。
所以上面是问题，先收集依赖，把这些使用到key的地方先收集起来，
等属性发生变化时，把收集好的依赖循环触发一遍就好

###依赖收集在哪
有了明确的目标，就是要在getter中收集依赖，那么依赖收集到哪里去呢？
首先，每个key都有一个数组，用来存储当前key的依赖，假设依赖是一个函数
存在window.target上
```javascript
function defineReaction(data,key,val) {
  let dep = []
  Object.defineProperty(data, key, {
      enumerable:true,
      configurable:true,
      get:function() {
        dep.push(window.target) //新增
        return val
      },
      set:function(newVal) {
        if(val === newVal){
            return
        }
        for(let i =0;i< dep.length;i++){
            dep[i](newVal,val)
        }
        val = newVal
      }
  })
}
```
在defineReactive中新增了数组dep，用来存贮收集的依赖
然后在触发set时，循环dep把收集的依赖触发。
但这样写有点耦合，把依赖收集这部分代码封装起来
```javascript
export default class Dep {
    static target: ?Watcher;
    id:number;
    subs: Array <Watcher>;
    
    constructor () {
        this.id = uid++
        this.subs = []
    }
    addSub (sub: Watcher) {
        this.subs.push(sub)
    }
    removeSub(sub:Watcher){
        remove(this.subs, sub)
    }
    depend() {
        if(Dep.target){
            this.addSub(Dep.target)
        }
    }
    notify() {
        const subs = this.subs.slice()
        for(let i = 0, l = subs.length;i<l;i++) {
            subs[i].update()
        }
    }
}
```
