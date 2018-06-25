
// [1,[2,3],4] '[a,[b],c]' => {a:1,b:2,c:3}

    //首先把'[a,[b],c]' 转换成有key组成的数组['a',['b'],'c'] 的形式
const destructuringArray = function (arr, keyStr) {
    const keyArr = JSON.parse(keyStr.replace(/(\w+)/g, '"$1"'));
    console.log(keyArr);
    return (function resolveKey(keyA, valueA) {
          return keyA.reduce((accObj,curObj, i) => {
              if(Array.isArray(curObj)){
                  return { ...accObj, ...resolveKey(curObj,valueA[i])}
              }else {
                  accObj[curObj] = valueA[i]
                  return accObj
              }
          },{})
      })(keyArr, arr)
}
let res = destructuringArray([1,[2,4],3], '[a,[b],c]')
console.log(res);