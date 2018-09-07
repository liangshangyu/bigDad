/**
 * function* name([param[, param]]){statements}
 * @name 函数名
 * @param 要传递给函数的一个参数的名称 最多有255个参数
 * @statements 普通JS语句
 * */
function *fibs(){
    var a=0;
    var b=1;
    while(true){
        yield a;
        [a,b]=[b,a+b]
    }
}
var res = fibs()
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
console.log(res.next());
const [a,b,c,d,e,f] = fibs()
console.log([a,b,c,d,e,f])
/*
* 生成器函数，返回一个Generator对象
* 生成器函数在执行时能暂停，后面又能从暂停处继续执行
* 调用一个生成器函数并不会马上执行里面的语句，而是返回一个这个
* 生成器的迭代器对象。这个迭代器的next() 方法被首次（后续）调用时
* 其内的语句会执行到第一个（后续）出现的yield的位置为止，yield后紧跟
*要返回的值。如果用的是yield* （多个星号）则表示将执行权移交给另一个生成器函数
*  当前生成器暂停执行
*
*  next()方法返回一个对象，这个对象包含两个属性：value和done
*  value表示本次yield表达式的返回值 done属性为布尔类型，表示
*  生成器后续是否还有yield语句即生成器函数是否已经执行完毕并返回
*  如果next()方法传入了参数，那么这个参数会作为上一条执行的yield语句的返回值
*
*  当在生成器函数中显示return时，会导致生成器函数立即变为完成状态，即next()
*  返回的对象的done为true。如果return后面跟了一个值，那么值会作为当前
*  调用next()方法返回的value值
* */
function* idMaker(){
    var index = 0
    while(index < 3) {
        yield index ++
    }
}
var gen = idMaker();
console.log(gen.next().value);

//生成器也可以接受参数
function* idMaker2(){
    var index = arguments[0] || 0
    while(true){
        yield index ++
    }
}

//yield* 的示例
function* antherGen(i){
    yield i+1;
    yield i+2;
    yield i+3;
}
function* generator(i){
    yield i
    yield* antherGen(i)
    yield i + 10
}
var gen = generator(10)
console.log(gen.next().value);
console.log(gen.next().value);
console.log(gen.next().value);

//传递参数
function* createIterator(){
    let first = yield 1;
    let second = yield first + 2
    yield second + 3
}
var gen = createIterator()
console.log(gen.next());  //输出1
console.log(gen.next(4)); //4会作为上一次yield的输出 4 + 2
console.log(gen.next(5)); //5做回second的输出 5＋3
console.log(gen.next());