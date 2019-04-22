/**
 * Created by 17073565 on 2018/5/22.
 */
//{a:1,b:2,c:3}  属性为c 值为3
let obj = {a:1,b:2,c:3}
let keys = []
let values = []
for(var key in obj){
    keys.push(key)
    values.push(obj[key])
}
console.log(keys);
console.log(values);

let res = Object.entries({a:1,b:2,c:3}).reduce(
    ([accK,accV],[curK,curV]) => accV ? [accK,accV] : [curK,curV],[]
)
console.log(res);
