/**
 * Created by 17073565 on 2018/5/21.
 */
//按照某个特定数字的差值排序
const maxCount = (arr, num) => arr.map((v,i) => ({
    i,
    c:Math.abs(v- num)
})).sort((a,b) =>a.c -b.c).map(item => arr[item.i])
const arr = [2,1,4,5]
console.log(maxCount(arr, 2));