function father(name) {
    this.name = name || 'lsy';
    this.code = function () {
        console.log(this.name + 'coding')
    }
}

father.prototype.add = function (food) {
    console.log(this.name + 'eat' + food)
}

function son(name) {
    father.call(this);
    this.name = name || 'lsy jr'
}
son.prototype = new father();
var sonVar = new son('faker');
son.prototype.constructor = son;
console.log(sonVar.code())