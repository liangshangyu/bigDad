/*
单原型链继承存在两大问题
1. 引用类型会被所有实例共享
2. 在创建子类型时，不能向父类构造函数传递参数
*/

/*
经典继承（借用构造函数）
*/
function Father(name){
    this.colors = ['red','blue','green']
    this.name = name
}
Father.prototype.sayName = function(){
    console.log(this.name);
}
function Son(){
    Father.call(this)
}
var instance1 = new Son('lsy')
instance1.colors.push('black')
//console.log(instance1.sayName());
console.log(instance1.colors);
var instance2 = new Son()
console.log(instance2.colors);

/*
* 缺陷：父类函数对子类而言不可见
* */

//组合继承
function Father1(name) {
    this.name = name
    this.colors = ['red','blue', 'green']
}
Father1.prototype.sayName = function() {
    console.log(this.name);
}
function Son1(name,age){
    Father1.call(this,name) //继承实例属性  第一次调用Father()
    this.age = age
}
Son1.prototype = new Father() //继承父类方法  第二次调用Father()
Son1.prototype.sayAge = function() {
    console.log(this.age);
}
var instance3 = new Son1('lsy',18)
instance3.colors.push('black')
console.log(instance3.colors);
console.log(instance3.sayName());
console.log(instance3.sayAge());

var ins4 = new Son1('LSY',15)
console.log(ins4.colors);
console.log(ins4.sayName());
console.log(ins4.sayAge());
//缺点： 调用了两次父类构造函数

//ES6的Object.create()；其最初是在object()函数内部，先创建一个临时的构造函数，然后将传入的对象作为
//这个构造函数的原型，最后返回这这个临时类型的一个新实例
function object(o){
    function F(){}
    F.prototype = o
    return new F()
}
//本质上是object对传入其中的对象执行一次浅复制
//ES6新增object.create()方法规范化上面的原型式继承


//寄生继承 创建一个仅用于封装继承过程的函数，该函数内部以某种方式来增强对象，最后返回对象
function createAnthor(original){
    var clone = object(original) //通过调用object函数创建一个新对象
    clone.sayHi = function(){   //以某种方法来增强这个对象
        console.log('hi');
    }
    return clone
}

//寄生组合继承；就是为了降低调用父类构造函数的开销；不必为了指定子类的原型在调用父类
function extend(subClass,superClass){
    var prototype = object(superClass.property)//创建对象
    prototype.constructor = subClass  //增强对象
    subClass.prototype = prototype    //指定对象
}

