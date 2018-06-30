const obj = {
    name:'a',
    getName:function () {
        console.log(this.name);
    }
};
var fn = obj.getName;
console.log(obj.getName());