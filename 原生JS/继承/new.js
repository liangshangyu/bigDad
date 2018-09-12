//new运算符 做三件事
/*
var obj = {}   创建一个空对象obj
obj.__proto__ = F.prototype  将空对象的__proto__ 指向F函数对象的prototype
F.call(obj)  将F函数对象的this指针替换成obj
*/
/*
* 我们可以这么理解: 以 new 操作符调用构造函数的时候，函数内部实际上发生以下变化：
1、创建一个空对象，并且 this 变量引用该对象，同时还继承了该函数的原型。
2、属性和方法被加入到 this 引用的对象中。
3、新创建的对象由 this 所引用，并且最后隐式的返回 this.
* */
