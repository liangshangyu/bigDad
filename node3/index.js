const fs = require("fs");
const AdmZip = require('adm-zip'); // 引入查看zip文件的包
const zip = new AdmZip('a.docx'); // 文件路径(先将docx格式的文件的扩展名改为。zip)
zip.extractAllTo("./result", /*overwrite*/true);
let contentXml = zip.readAsText("word/document.xml");//将document.xml读取为text内容；
let str = "";
contentXml.match(/<w:t>[\s\S]*?<\/w:t>/ig).forEach((item)=>{
    str += item.slice(5,-6)});

var result = str;
result = result.replace(/(^\s+)|(\s+$)/g,"");// 去除空格
result = result.replace(/\s/g,"");
console.log(result);// 输出字符串
//console.log(result.length);// 输出字数
fs.writeFile("./1.txt",str,(err)=>{// 将./2.txt替换为你要输出的文件路径
    if(err)throw err;
});
