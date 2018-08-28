
const cloneDeep = (obj) => {
    if(typeof  obj !== 'object' || obj === null){
        return obj
    }
    switch (Object.prototype.toString.call(obj)) {
        case '[object Array]':
            return Object.entries(obj).reduce((acc, [ket, value]) => Object.assign(acc, {[key]: cloneDeep(value)}),[]);
        case '[object RegExp]':
        case '[object Date]':
        case '[object Boolean]':
        case '[object String]':
        case '[object Number]':
            return new obj.constructor(obj)
        default:
            return Object.entries(obj).reduce( (acc, [key,value]) => Object.assign(acc, {[key]:cloneDeep((value))}),{})
    }
};

function deepCopy(p, c) {
    var c = c || {};
    for(var i in p){
        if(typeof p[i] === 'object'){
            c[i] = (p[i].constructor === Array) ? [] :{};
            deepCopy(p[i], c[i])
        }else {
            c[i] = p[i]
        }
    }
    return c
}
let obj = {a:1,b:3}
let res =deepCopy(obj, {})
console.log(res);
console.log(res == obj);
