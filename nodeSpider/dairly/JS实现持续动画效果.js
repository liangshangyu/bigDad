window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame      ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           function (callback) {
               window.setTimeout(callback, 1000 / 60)
           }
})();

var e = document.getElementById('e');
var flag = true;
var left = 0;

function render() {
    left == 0 ? flag = true : left == 100 ? flag = false : '';
    flag? e.style.left = `${left++}px` :
        e.style.left = `${left--}px`;
}
(function animloop() {
    render();
    requestAnimationFrame(animloop)
})();