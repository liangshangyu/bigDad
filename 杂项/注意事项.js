//parseInt()接受两个参数 val值，radix基数， 基数 0 代表 10进制; 二进制不可能有 3

//null 代表空指针 用typeof判断为一个对象，instanceof 就不是

//[].reduce(Math.pow) 空数组会报错; [1].reduce(Math.pow) 只有初始值不会执行函数，直接返回1
//[].reduce(Math.pow，1) 只有初始值 直接返回1

//=== 优先级高于 &&

var ary = [0,1,2];
ary[10] =10; // ary[0,1,2,empty X 7, 10];
//filter不会对空数组进行检测 会跳过哪些空元素

new String('A') // String {'A'}

String('A') //A


Array.isArray(Array.prototype)// true
//数组的原型是数组  对象的原型是对象  函数的原型是函数


[] == [] //false 两个引用类型 == 比较的是引用地址，引用类型之间比较大小，先比第一项谁大，相同再去比第二项
[] !== [] // true
[] == ![] // true ![] 是false  0 == false 为true


'5' + 3 //53 '53'
'5' - 3//2  加号有拼接功能  减号就是逻辑运算


//JS 运算符
 || //只要前面是false， 不管后面是true 还是 false 都返回后面的值
    //只要前面是true， 都返回前面的值

 && //只要前面是false， 无论后面是true 还是 false 都返回前面的值
 	//只要前面是true 无论后面是treu 还是 false 都返回后面的值   

//在JS中 1.1 , 1. , .1都是合法的数字
