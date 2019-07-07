var canvas = document.querySelector('canvas')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
var c = canvas.getContext('2d')
// c.fillStyle = 'rgba(255,0,0,0.1)'
// c.fillRect(100,100,100,100)
// c.fillStyle = 'rgba(0,255,0,0.5)'
// c.fillRect(400,100,100,100)


// //line
// c.beginPath();
// c.moveTo(50,300);
// c.lineTo(300,100)
// c.lineTo(400,300)
// c.strokeStyle = 'pink'
// c.stroke()

var x = Math.random() * innerWidth  //200
var y = Math.random() * innerHeight //200
var dx = 4;
var dy = 4
var radius = 30
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth, innerHeight)
    c.beginPath()
    c.arc(x,y,radius,0,Math.PI * 2, false)
    c.strokeStyle = 'blue'
    c.stroke()
    x += dx;
    y+= dy
    if (x + radius > innerWidth || x -radius < 0) {
        dx = -dx;
    }
    if (y + radius > innerHeight || y -radius < 0) {
        dy = -dy;
    }
}
animate()