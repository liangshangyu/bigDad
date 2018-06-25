//把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。
//实现add(1,2,3)(1)(2)(3)()
function add() {
	//建立args 利用闭包的特性，不断保存arguments
	var args = [].slice.call(arguments);

	//方法一 新建_add函数实现柯里化
	var _add = function() {
		if(arguments.length === 0){
			return args.reduce(function(a,b){return a+b})
		}else {
			[].push.apply(args,arguments);
			return _add;
		}
	}
	return _add

/*	//方法而 使用arguments.callee实现柯里化
	return function () {
		if(arguments.length === 0){
			return args.reduce(function (a,b) {
				return a+b
            })
		}
		Array.prototype.push.apply(args, arguments);
		return arguments.callee;
    }*/
}
console.log(add(1,2,3)(1)(2)(3)());

//通用的函数柯里化构造方法
function curry(func) {
	var args = [].slice.call(arguments, 1);
	var _func = function() {
		if(arguments.length === 0){
			return func.apply(this, args);
		}else {
			[].push.apply(args, arguments);
			return _func;
		}
	}
	return _func;
}
function add1() {
	return [].reduce.call(arguments,function (a,b) {
		return a + b;
    })
}
console.log(curry(add1, 1, 2, 3)(1)(2)());

//柯里化的作用
/*
* 1.
*
* */
Function.prototype.bind = function () {
	var fn = this;
	var args = Array.prototype.slice.call(arguments);
	var context = args.shift();

	return function () {
		return fn.apply(context,args.concat(Array.prototype.slice.call(arguments)))
    }
}