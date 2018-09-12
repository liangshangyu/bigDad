//object.create() 实现类式的继承
//Shape - 父类（superclass）
function Shape(){
    this.x = 0
    this.y = 0
}

//父类的方法
Shape.prototype.move = function(x,y){
    this.x += y
    this.y += y
    console.info('Shape moved.')
}
//Rectangle - 子类（subclass）
function Rectangle() {
    Shape.call(this)
}
//子类继承父类
Rectangle.prototype = Object.create(Shape.prototype)
Rectangle.prototype.constructor = Rectangle //重写构造函数指向

var rect = new Rectangle()
console.log('Is rect an instance of Rectangle?',rect instanceof Rectangle)
console.log('Is rect an instance of Shape?', rect instanceof Shape)
rect.move(1,1)

