var func = (function (a) {
    this.a  = a;
    return function (a) {
        a += this.a;
        return a
    }
})(function (a,b) {
    return a
}(1,2))
//console.log(func(4));
var x = 10,
    foo = {
        x: 20,
        bar: function() {
            var x = 30;
            return this.x;
        }
    }

console.log(foo.bar());
console.log((foo.bar)());
console.log((foo.bar = foo.bar)());
console.log((foo.bar, foo.bar)());