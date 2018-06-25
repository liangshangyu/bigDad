//1. String.formCharCode
console.log(String.fromCharCode(65)); //A

String.fromCodePoint(43);


//charAt 返回指定的字符
let anyStr = 'brave new world';
console.log(anyStr.charAt(0));

//charCodeAt
console.log(anyStr.charCodeAt(0));
console.log(anyStr.codePointAt(0));

//indexOf() 返回调用对象中第一次出现的指定值的索引 没有返回-1 该方法区分大小写
console.log(anyStr.indexOf('r'));

//slice 提取一个字符串的一部分，并返回一个新的字符串
//String.slice(m,n) //包含m， 不包含 n
console.log(anyStr.slice(1, 3));  //ra

//split()  使用指定的分隔符将一个string对象分割成字符串数组 第二个参数可以传入数字
console.log(anyStr.split(' '));

//substr(start, length) 返回一个字符串中从指定位置开始到指定字符数的字符, length为0或负值 返回空字符串  不填则默认到元字符串最后
console.log(anyStr.substr(1));

//substring(startIndex, endIndex) 包前不包后；两个参数相等则返回空；省略endIndex则知道结尾
//如果任一参数下于0 或为Nan 当作 0处理；大于字符串长度 则当做 字符串长度处理
console.log(anyStr.substring(6, 2));

const str1 = 'ASAS';
console.log(str1.toLocaleLowerCase());
console.log(str1.toLowerCase());
console.log(str1);