/*
* 变量的作用域
*   如果这个变量前面没有带关键字var 这个变量就会成为全剧变量
*   用var关键字在函数中声明的变量 局部变量 只有在该函数内部才能被访问
* */
var func = function() {
    var a = 1 // 退出函数后局部变量a将被销毁
    alert ( a )
}
func()
alert(a) // referenceError

/*变量的生存周期
*   全局变量的生存周期是永久的
*   局部变量 当函数销毁时候被销毁
*   闭包可以延续变量的生成周期
* */
var func = function() {
    var a = 1
    return function() {
        a++
        alert(a)
    }
}
var f = func()
f()
f()

/*
* 闭包还可以封装变量
* */

// 高阶函数
/*
*   函数作为参数传递
*   函数作为返回值输出
* */
var getUserInfo = function (userId, callback) {
    $.ajax('' + userId, function(data) {
        if (typeof callabck == 'function') {
            callback(data)
        }
    })
}
//currying
var currying = function(fn) {
    var args = []
    return function() {
        if (arguments.length == 0) {
            return fn.apply(this, args)
        }else {
            [].push.apply(args, arguments)
            return arguments.callee
        }
    }
}
var cost = (function() {
    var money = 0;
    return function(){
        for (var i = 0, len = arguments.length; i < len ; i++) {
            money += arguments[i]
        }
        return money
    }
})()
var cost = currying(cost)

//节流函数
var throttle = function(fn ,interval) {
    var _self = this //保存需要被延迟执行的函数引用
    var firstTime = true
    return function () {
        var args = arguments
        _me = this
        if (firstTime) {
            _self.apply(_me, args)
            return firstTime = false
        }
        if (timer) {
            return false
        }
        timer = setTimeout(function() {
            clearTimeout(timer)
            timer = null
            _self.apply(_me, args)
        }, interval || 500)
    }
}




