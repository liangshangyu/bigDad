//全局变量 局部变量 函数内部可以直接读取全局变量，函数外部无法读取函数内的局部变量

//从外部读取局部变量，函数内部在定义一个函数
function f1() {
	var n =99;
	function f2() {
		alert(n) //99
	}
	return f2;
}
var res = f1();
res(); //99

//函数f2被包括在函数f1内部，这是f1内部的所有局部变量，对f2都是可见的。但是反过来就不是 ，这是js的链式作用域结构
//子对象会一级一级向上寻找所有父对象的变量。既然f2可以读取规f1中的局部变量，那么只要把f2作为返回值 就可以在f1外部读取它的内部变量
//f2函数就是闭包


//闭包的作用 1）读取函数内部变量 2）让这些变量始终保持在内存中

function f3() {
	var n = 999;
	nAdd = function() {n+=1}
	function f4() {
		alert(n);
	}
	return f4;
}
var result = f3();
result(); //999
nAdd();
result(); //1000

//result就是闭包f2函数
function A(){
	var funs = [];
	for(var i=0;i<10;i++){
		funs[i] = function() {
			return i;
		}
	}
	return funs;
}
var funs = A();   //为执行，只是定义函数
console.log(funs[0]())  //10
console.log(funs[1]())  //10
console.log(funs[6]())  //10
