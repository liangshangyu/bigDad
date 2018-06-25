/**
 * Created by 17073565 on 2018/5/21.
 */
Math.floor(3.5)   //3 向下整

//Array.from() 将一个类数组对象或者可遍历对象转成一个真正的数组,最基本的是具有length属性
let arrayLike = {
    0: 'tom',
    1: '65',
    'length':2
}
let arr = Array.from(arrayLike)
console.log(arr);
//该类数组必须要有length属性 用于指定数组长度，没有则转换后为空数组
//该类数组对象的属性名必须为数值型或者字符型的数字

//Array.from 还接受第二个参数 作用类似数组的map方法，用于对每个元素进行处理
console.log(Array.from([1, 2, 3], (item, i) => item + 2));
//还可以将字符串转化为数组
