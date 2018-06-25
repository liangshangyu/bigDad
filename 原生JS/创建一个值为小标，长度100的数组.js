/**
 * Created by 17073565 on 2018/5/21.
 */
console.log(new Array(100).map((v, i) => i));  //[empty x 100]

Array.from({length: 100}, (v, i) => i);
new Array(100).fill(undefined).map((v,i) => i);
Array.apply(null, {length:100}).map((v, i) => i);
[...new Array(100)].map((v,i)=> i)


(function fill(i,arr) {
    return i > 99? arr : fill(i +1,arr.concat(i))
})(0,[]);

