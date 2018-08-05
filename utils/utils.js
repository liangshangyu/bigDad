/*截取指定字节数的字符串*/
/**
 * @param str 要截取的字符串
 * @param len 要截取的长度，根据字节计算
 * @param suffix 截取前len个后，其余的字符的替换字符，一般用‘...’
 * @return {*}
 * */

function cutString(str, len, suffix) {
    if(!str) return "";
    if(len <= 0) return "";
    if(!suffix) suffix = "";
    var templen = 0;
    for(var i =0;i<str.length; i++){
       if(str.charCodeAt(i) > 255){
           templen += 2;
       }else {
           templen++
       }
       if(templen == len){
           return str.substring(0, i + 1) + suffix;
       }else if(templen > len){
           return str.substring(0, i) +suffix;
       }
    }
    return str;
}
let str = 'asdfgh';
let res = cutString(str,3,'l');
console.log(res);

/*判断是否微信*/
/**
 * @returns {Boolean}
 * */
function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessage/i) == 'micromessage') {
        return true;
    }else {
        return false
    }
}
let res1 =isWeixin();
console.log(res1);

/*获取字符串字节长度*/
/**
 * @param {String}
 * @returns {Boolean}
 * */
function checkLength(v) {
    var realLength = 0;
    var len = v.length;
    for(var i=0;i<len;i++){
        var charCode = v.charCodeAt(i);
        if(charCode >=0 && charCode <= 128){
            realLength += 1;
        }else {
            realLength += 2
        }
    }
    return realLength
}

/*对象的克隆 深拷贝*/
/**
 * @param obj
 * @returns {{}}
 * */
function cloneObj(obj) {
    var newO = {}
    if(obj instanceof Array){
        newO = []
    }
    for(var key in obj ){
        var val = obj[key]
        newO[key] = typeof  val === 'object'? arguments.callee(val) : val;
    }
    return newO
}

/**
 * 深拷贝 增强版
 * @param obj
 * @returns {{}}
 * */
function cloneDeep(obj) {
    //处理 3种类型的数据 和 null undefined
    if(null === obj || "object" != typeof  obj) return obj
    if(obj instanceof Date){
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy
    }
    if(obj instanceof Array){
        var copy = [];
        for(var i=0;i< obj.length; ++i){
            copy[i] = clone(obj[i])
        }
        return copy;
    }

    if(obj instanceof Object){
        var copy = {}
        for(var attr in obj){
            if(obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
        }
        return copy
    }
    throw new Error('Unable to copy obj! Its type isn‘t support')
}


