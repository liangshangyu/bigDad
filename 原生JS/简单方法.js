function foo(o, arr){
    var obj = {}
    arr.forEach((i)=> obj[i] = o[i])
    return obj
}


function foo2(o, arr) {
    return arr.reduce((acc, v) => {
        acc[v] = o[v]
        return acc
    }, {})
}

const ROOT_DOMAIN = `.${document.domain.split('.').slice(-2).join('.')}` || '.haiziwang.com';