function dispatch(n, m){
    var i , j, arrays = [];
    for(i=0; i< m; i++){
        arrays.push([])
    }
    for(i=1, j= 0; i<= n;i++, j = (j+1) % m){
        arrays[j].push(i)
    }
    return arrays
}

console.log(dispatch(5, 2));