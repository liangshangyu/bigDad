/**
 * Created by 17073565 on 2018/5/21.
 */
const arr = [1,4,5,6,2,4,5,1,7,8,'19',19,'19',18,'18']
const obj = {}
const repeat_arr = []
arr.forEach( v => {
    //console.log(v + typeof v)
    if(obj[v + typeof  v]){
        repeat_arr.push(v)
    }else {
        obj[v + typeof v] = 1
    }
})
/*
 {
 '1number': 1,
 '4number': 1,
 '5number': 1,
 '6number': 1,
 '2number': 1,
 '7number': 1,
 '8number': 1,
 '19string': 1,
 '19number': 1,
 '18number': 1,
 '18string': 1
 }
*/
console.log(repeat_arr);
console.log(typeof 4)
console.log(obj);

//去重 set
[...new Set(arr)]

const find_dup = arr => [...new Set(arr.filter(i => arr.indexOf(i) !== arr.lastIndexOf(i)))]