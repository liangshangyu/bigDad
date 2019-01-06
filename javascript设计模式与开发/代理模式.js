var Flower = function() {}
var xiaoming = {
    sendFlower: function(target){
        var flower = new Flower()
        target.receiveFlower(flower)
    }
}
var B = {
    receiveFlower: function(flower) {
        A.listenGoodMood(function () {
            var flower = new Flower()
            A.receiveFlower(flower)
        })
    }
}
var A = {
    receiveFlower: function(flower) {

    },
    listenGoodMood: function(fn) {
        setTimout(function(){
            fn()
        }, 1000)
    }
}
xiaoming.sendFlower(B)
