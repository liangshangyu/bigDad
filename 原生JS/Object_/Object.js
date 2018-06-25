//Object构造函数为给定值创建一个对象包装器，如果给行值是null或undefined，将会创建并返回一个空对象，否则将返回一个与给定值对应类型的对象

//Object构造函数的属性
Object.length   //值为 1

Object.prototype //

//Object构造函数的方法

const object1 = {
    a:1,
    b:2,
    c:3
}
//将所有可枚举属性的值从一个或多个源对象赋值到目标对象,并且不会跳过值为null 或者 undefined的源对象
const obj2 = Object.assign({c:4,d:5},object1);
console.log(obj2);

//创建一个新对象，使用现有的对象来提供新创建的对象的__proto__ 返回一个新对象
const person = {
    isHuman:false,
    output:function () {
        console.log(`my name is ${this.name}`)
    }
}
const me = Object.create(person)
me.name = 'Lsy'
me.output()

//该方法直接在一个对象上定义新的属性或修改现有属性并且返回该对象
let o = {};
Object.defineProperties(o, {
    "property1":{
        value:true,
        writable:true
    },
    "property2":{
        value:'hello',
        writable:false
    }
});
console.log(o.__proto__);

//返回指定对象上 一个 自有属性对应的属性描述符（自有属性是指直接赋予该对象的属性，不需要从原型链上进行查找）
//在JS中属性 由一个字符串类型的（name）和一个属性描述符(property descriptor)对象构成
//属性描述符 可以由一下值组成 value writable get set configurable enumerable
let b = {get foo() {return 77}};
d = Object.getOwnPropertyDescriptor(b,'foo');
console.log(d);

//Object.getOwnPropertyDescriptors()

//返回指定对象的原型 Object.getPrototypeOf
var proto = {};
var obj3 = Object.create(proto)
console.log(Object.getPrototypeOf(obj3) === proto);

//返回布尔值 指示对象 自身 属性中是否具有指定的属性
Object.hasOwnProperty()