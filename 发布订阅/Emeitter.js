/**
 * Created by 17073565 on 2018/5/8.
 */
class EventEmeitter{
    constructor () {
        this._events = this._events || new Map();       //储存时间/回调键值对
        this._maxListeners = this._maxListeners || 10;  //设置监听上限
    }
}

//触发名为type的事件
EventEmeitter.prototype.emit = function (type, ...args) {
        let handler;
        handler = this._events.get(type);
        if(Array.isArray(handler)){
            for(let i=0;i<handler.length;i++) {
                if (args.length > 0) {
                    handler[i].apply(this,args)
                }else {
                    handler[i].call(this)
                }
            }
        }else {
            if(args.length > 0){
                handler.apply(this, args)
            }else {
                handler.call(this)
            }
        }
        return true
}

EventEmeitter.prototype.addListener = function (type, fn) {
    const handler = this._events.get(type) //获取对应事件名称的函数清单
    if(!handler) {
        this._events.set(type, fn)
    }else if(handler && typeof handler === 'function') {
        this._events.set(type, [handler,fn])
    }else {
        handler.push(fn)
    }
    /*//将type事件以及对应的fn函数放入this._events 中储存
    if(!this._events.get(type)){
        this._events.set(type, fn)
    }*/
}
EventEmeitter.prototype.removeListener = function (type, fn) {
    //获取对应事件名称的函数清单
    const handler = this._events.get(type)
    //如果是函数 说明只被监听了一次
    if(handler && typeof handler === 'function'){
        this._events.delete(type, fn)
    }else {
        let postion;
        //如果 handler 是数组，说明被监听多次，要找到对应的函数
        for (let i=0;i<handler.length; i++) {
            if(handler[i] === fn) {
                postion = i
            }else {
                postion = -1
            }
        }
        //如果找到匹配的函数，从数组中移除
        if(postion !== -1) {
            handler.splice(postion, 1)
            if(handler.length === 1) {
                //删除的只剩下一个了，就取消数组，以函数形式保存
                this._events.set(type, handler[0])
            }
        }else {
            return this
        }
    }
}