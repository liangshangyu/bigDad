/**
 * Created by 17073565 on 2018/5/21.
 */
//Object.entries() 方法返回一个给定对象自身可枚举属性的键值对数组
const obj = {foo:'bar', baz:41}
console.log(Object.entries(obj));
console.log(Object.values(obj));
console.log(Object.keys(obj));
//同样使用数组和字符串
console.log(Object.entries('1c'));
console.log(Object.entries([1,2]));