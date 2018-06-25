/**
 * Created by 17073565 on 2018/5/21.
 */
//问题：有一个10级的阶梯，一次智能跨1级或者2级  求走到10级有多少种走法
//假设只差最后下完成，会有几种情况？只有两种
function fibonacci(n) {
    if(n <= 0) return 0
    if(n === 1) return 1

    return fibonacci(n -1) +  fibonacci(n - 2)
}
console.log(fibonacci(10));

//咋看没有问提，但是f(10) = f(9) + f(8);f(9) = f(8) + f(7) 看到f(8)做了两次运算
//使用哈希表来缓存 map来存储 n为key
function _fibonacci(n) {
    const m = new Map()
    function fn(x) {
        if(x <= 0) return 0
        if(x === 1) return 1
        if(m.has(x)) {
            return m.get(x)
        }
        const v = fn(x -1) + fn(x -2)
        m.set(x,v)
        return v
    }
    return fn(n)
}
console.time('map/slow')
console.log(_fibonacci(20));
console.time('map/slow')

//其实不必自顶向下做递归运算 可以尝试自下向上，f(3) = f(2) + f(1);f(4)=f(3) + f(2);可以看出到f(4) 的时候就不再需要f(1)
//只保留前面两个值就好
function __fibonacci(n) {
    if(n <= 0) return 0
    if(n === 1) return 1
    let a = 0;
    let b = 1;
    let t = 0;

    for(let i=2;i<= n;i++) {
        t = a +b;
        a = b;
        b = t;
    }
    return t
}