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
// var x = Math.random() * innerWidth  //200
// var y = Math.random() * innerHeight //200
// var dx = 4;
// var dy = 4
// var radius = 30
var mouse = {
    x:undefined,
    y:undefined
}
var maxRarius = 40
//var minRadius = 2

var colorArray = [
    '#ffaa33',
    '#99ffaa',
    '#00ff00',
    '#4411aa',
    '#ff1100'
]

window.addEventListener('resize', function(e){
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
})
window.addEventListener('mousemove', function(e){
    mouse.x = e.x
    mouse.y = e.y
})
function Circle(x,y,dx,dy,radius) {
    this.x = x;
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.minRadius = radius
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)]
    this.draw = function() {
        c.beginPath()
        c.arc(this.x, this.y,this.radius,0, Math.PI * 2, false)
        // c.strokeStyle = 'blue'
        // c.stroke()
        c.fillStyle = this.color
        c.fill()
    }

    this.update = function() {
        if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
            this.dx = -this.dx
        }
        if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy
        }
        this.x += this.dx
        this.y += this.dy

        //interactive
        if(mouse.x - this.x < 50 && mouse.x - this.x > -50
                && mouse.y - this.y < 50 && mouse.y - this. y > -50
            ){
            if(this.radius < maxRarius){   //小于最大半径
                this.radius += 1
            }

        }else if(this.radius > this.minRadius) {
            this.radius -= 1
        }
        this.draw()
    }
}

var circleArray = []
function init() {
    circleArray = []
    for(var i = 0;i<800;i++){
        var radius = Math.random() * 3 + 1
        var x = Math.random() * (innerWidth - radius * 2) + radius
        var y = Math.random() * (innerHeight - radius * 2) + radius
        var dx = (Math.random() - 0.5) * 2
        var dy = (Math.random() - 0.5) * 3
        circleArray.push(new Circle(x,y,dx,dy,radius))
    }
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,innerWidth, innerHeight)
    for(var i = 0; i< circleArray.length; i++) {
        circleArray[i].update()
    }
}
init()
animate()