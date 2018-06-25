/**
 * Created by 17073565 on 2018/5/8.
 */
//ES6提供了Map 数据结构。类似于对象，但是“键”的范围不限于字符串
//如果需要键值对的数据结构  Mao 比 Object 更适合
const m  = new Map()
const o = {p:'Hell World'}
m.set(o, 'content')
m.get(o)
console.log(m);
console.log(m.get(o));