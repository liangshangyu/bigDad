/*
* 1)使用eval
* 2)使用es6解构
* */
function call(context){
    var context = context || window
    context.fn = this
    var args = []
    for (var i=0; i< arguments.length;i++) {
        args.push('arguments[' + i + ']')
    }
    var result = eval('context.fn' + args +')')
    delete context.fn
    return result
}
function myCall(context) {
    var args = Array.prototype.slice.apply(arguments, 1)
    context.fn = this
    context.fn(...args)
    delete context.fn
}

function myApply(context, arr) {
    var context = context || window
    context.fn = this
    var result
    if (!arr) {
        result = context.fn()
    }else {
        var args = []
        for (var i = 0;i<arr.length; i++) {
            args.push('arr['+ i +']')
        }
        result = eval('context.fn(' + args + ')')
    }
    delete context.fn
    return result
}