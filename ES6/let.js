`use strict`

var a = []
/*for(var i = 0;i<5;i++){
    a[i] = function(){
        console.log(i);//5 5 5 5 5
    }
}*/


for(let i = 0;i<5;i++){
    a[i] = function(){
        console.log(i);// 0 1 2 3 4
    }
}
for(var k of a){
    k()
}