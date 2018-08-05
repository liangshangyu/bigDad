//全局执行
console.log(this);//浏览器环境下是 window；node环境下是global

//函数中执行
function test() {
    console.log(this);
}
test(); //window

/*严格模式下是undefined*/
//作为对象的方法调用
var obj ={
    name:'lsy',
    foo:function () {
        console.log(this);
    }
}
obj.foo();//this指向当前对象

function test1() {
    console.log(this);
}
var obj1 ={
    name:'lsy',
    foo:test1
}
obj1.foo();

//若果把对象的方法赋值给一个变量，然后直接调用这个变量呢
var obj2 ={
    name:'lsy',
    foo:function () {
        console.log(this);
    }
}
var test2 = obj2.foo
test2();//window
//可以看到 这时候this指向了全局，当我们把test=obj.foo,test直接指向了函数的引用，这时候
//其实和obj这个对象没有关系了，所以他是当作一个普通函数执行

//作为一个构造函数使用
function Person(name) {
    this.name = name;
    console.log(this);
}
var p = new Person('lsy')   //Person {name:'lsy'}
//可以看到当作构造函数调用时 this指向了这个构造函数调用时候实例化出来的对象
//当然构造函数也是函数，如果把它当作一个普通函数执行 this仍指向全局
var p = Person('lsy') //window

//箭头函数
var obj3 = {
    name:'lsy',
    foo:function () {
        console.log(this);
    },
    foo2:function () {
        console.log(this);
        setTimeout(() => {
            console.log(this); //Object {name:'lsy'}
        },1000)
    }
}
obj3.foo2()

//箭头函数中的this只和定义它时候的作用域this有关，而与在哪里以及如何调用它无关，this指向不可改变

//当函数独立调用的时候，在严格模式下它的this指向undefined，在非严格模式下，当this指向undefined的时候，
//自动指向全局对象(浏览器中就是window)

//当obj在全局声明的时候，obj内部属性中的this指向全局对象，当obj在一个函数中声明的时候，严格模式下this会指向undefined，
// 非严格模式自动转为指向全局对象。

//this在函数的不同调用方式下的指向
//一：在全局环境或是普通函数中直接调用
//二 作为对象的方法
//三 使用apply call bind
//四：在构造函数中调用  如果函数作为构造函数用，那么其中的this就代表它即将new出来的对象
//伪代码
function Fun() {
    //new做的事
    var obj = {};
    obj.__proto__ = Fun.prototype;
    obj.name = 'LSY'
    return obj
}
//也就是说new做了下面这些事情
/*
* 创建一个临时对象
* 给临时对象绑定原型
* 给临时对象对应属性赋值
* 将临时对象return
* */

