/**
 * Created by 17073565 on 2018/5/21.
 */
//二维数组
const arr = [[1,2],3]
let arr2 = [].concat.apply([], arr)
console.log(arr2);

let arr1 = [].concat(...arr)
console.log(arr1);

//flatten函数，可用于多维数组
const flatten = (arr) => arr.reduce((a, b) => {
    if(Array.isArray(b)) {
        return a.concat(flatten(b))
    }
    return a.concat(b)
 },[])
const arr3 = [[1, 2], 3, [4, 3, [8, 9, [10, [11, [12, [13, [14, [15, [16, [17, [18]]]]]]]]]]]];
 arr4 = flatten(arr3)
console.log(arr4);

//改进 添加扁平化深度控制
const _flatten = (arr, depth =1) => arr.reduce((a,b) => {
    let i = 1;
    if(Array.isArray(b) && i < depth){
        i++;
        return a.concat(flatten(b))
    }
    return a.concat(b)
},[])

console.log(_flatten([1, [2, 3, [4, 5], 6], 7]));
console.log(_flatten([1, [2, 3, [4, 5], 6], 7], 5));






