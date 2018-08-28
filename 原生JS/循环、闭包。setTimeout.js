/*for(var i =0;i<5;i++){
    console.log(i); //0 1 2 3 4
}*/

/*
for(var i=0;i<5;i++){
    setTimeout(function(){
        console.log(i); // 5 5 5 5 5
    },1000*i)
}
*/

/*for(var i = 0;i<5;i++){
    (function(i){
        setTimeout(function(){
            console.log(i); // 5 5 5 5 5
        },1000 * i)
    })(i)
}*/

/*for(var i =0;i< 5;i++){
    (function(){
        setTimeout(function(){
            console.log(i); // 5 5 5 5 5
        },1000*i)
    })(i)
}*/

for(var i = 0; i < 5; i++){
    setTimeout((function(i){
        console.log(i); // 0 1 2 3 4
    })(i),1000 * i)
}

setTimeout(function(){
    console.log(1);
},0)
