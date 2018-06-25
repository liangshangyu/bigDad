/**
 * Created by 17073565 on 2018/5/21.
 */
//reduce()方法接受一个函数callbackFn作为 累加器，数组中的每个值（从左到右）开始合并 最终为一个值
//语法  array.reduce(callback,[initialValue])
//callback函数包含四个参数
function callbackFn(prevV,curV,index,array) {
    //prevV：上一次调用回调返回的值，或者提供的初始值（initialValue）
    //cueV: 数组中当前被处理的数组项
    //index: 当前数组项在数组中的索引
    //array：原数组
}
//reduce()方法为数组中的每一个元素一次执行回调函数callbackFn，如果initialValue被提供，那么prevV等于
//initialValue；否侧prevV是数组第一个值，curV数组第二个值

let arr =[0,1,2,3,4,]
let res = arr.reduce(function (prevV,curV,index,array) {
    return prevV + curV
},5)
console.log(res);

//实现数组求和
function reduceSum(array) {
    for(var i=0;i< array.length;i++){
        return array.reduce(function (prevV,curV) {
            return prevV + curV
        })
    }
}
console.log(reduceSum(arr));

//当arr不确定是否为空数组时候一定给初始值

//将二维数组转化为一维
var flattened = [[0,1],[2,3],[4,5]].reduce(function(a,b) {
        return a.concat(b);
},[]);

//计算数组中每个元素出现的次数
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];
var countedNames = names.reduce((allNames, name) => {
    if(name in allNames){
        allNames[name]++
    }else {
        allNames[name] = 1;
    }
    return allNames;
},{})

//数组去重
let arr = [1,1,2,3,2,5];
let result = arr.sort().reduce((init, current) => {
    if(init.length === 0 || init[init.length -1] !== current){
        init.push(current);
    }
    return init;
},[]);

function reduce(array, func, initialValue){
    var result = initialValue;
    for(var i = 0, len = array.length;i< len; i++){
        result = func.apply(null, [result].concat(array[i]));
    } 
    return result;
}

var res = reduce([1,2,3],function(){},0)