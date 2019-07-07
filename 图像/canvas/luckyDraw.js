let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')
canvas.width = 650
canvas.height = 650
let outRadius = 250         //圆盘半径
let insideRadius = 0        //内圆半径
let text_radius = outRadius * 0.8
center_x = canvas.width / 2
center_y = canvas.height / 2

let awards = [               // 转盘内的奖品个数以及内容
    '谢谢参与', 
    {
        text: '50元积分券',
        img: 'https://img12.360buyimg.com/n7/jfs/t4807/209/1436278963/496606/8e486549/58f0884eNcec87657.jpg'
    }, 
    '50元积分券', 
    '50元积分券', 
    '50元积分券', 
    '50元积分券', 
    '50元积分券', 
    '50元积分券'
]
let startRadius = 0
let awardRadius = (Math.PI * 2) / awards.length

//用于旋转的系数
let duration = 4000     //旋转时间
let velocity = 10       //旋转速率
let spinningTime = 0    //旋转当前时间
let spinTotalTime       //旋转总时间
let spinningChange      //峰值

/**
 * 缓动函数 由快到慢
 * @param t  当前时间
 * @param b  初始值
 * @param c  变化值
 * @param d  持续时间
 */
function easeOut (t,b,c,d) {
    if((t /= d / 2) < 1) return  c/ 2 * t *t + b;
    return-c / 2 * ((--t) * (t -2) - 1) + b
}

//绘制转盘
function drawRouletteWheel(){
    c.clearRect(0,0,canvas.width,canvas.height)
    // c.save();
    // let rgb = this.oddColor.replace('#', ''),
    //     r = parseInt(rgb[0] + rgb[1], 16),
    //     g = parseInt(rgb[2] + rgb[3], 16),
    //     b = parseInt(rgb[4] + rgb[5], 16);
        
    // c.fillStyle = `rgba(${r}, ${g}, ${b}, .72)`;
    // c.shadowColor = 'rgba(0, 0, 0, .24)';
    // c.shadowOffsetX = 0;
    // c.shadowOffsetY = 5;
    // c.shadowBlur = 15;
    // c.arc(this.centerX, this.centerY, this.outsideRadius, 0, Math.PI * 2, false);
    // c.fill();
    // c.restore();
    // ----------
    for(let i = 0;i<awards.length; i++){
        let _startRadius = startRadius + awardRadius * i  //每一个奖品的其实弧度
        let _endRadius = _startRadius + awardRadius        //终止弧度

        c.save()

        if (i % 2 === 0) c.fillStyle = '#CD6AF6'
	    else             c.fillStyle = '#D380FB';
        c.beginPath()
        c.arc(canvas.width / 2,canvas.height / 2,outRadius, _startRadius,_endRadius,false)
        c.arc(canvas.width / 2,canvas.height / 2,insideRadius, _startRadius,_endRadius,false)
        c.fill()

        c.restore()

        if(awards[i].img){
            let img = new Image()
            img.src = awards[i].img
            function drawImage(self, c){
                let size = Math.sin(awardRadius) *outRadius / 2.5
                c.save()
                c.translate(
                    center_x + Math.cos(_startRadius + awardRadius / 3) * text_radius ,
                    center_y + Math.sin(_startRadius + awardRadius / 3) * text_radius 
                )
                c.rotate(_startRadius + awardRadius / 2 + Math.PI / 2)
                c.drawImage(
                    img,
                    - size / 2,
                    0,
                    size,
                    size
                )
                c.restore()
            }
            if(!img.complete) {
                img.onload = function() {
                    drawImage(self,c)
                }
            }else {
                drawImage(self,c)
            }
            c.save()
            c.font = ''
            c.fillStyle = '#ffffff'
            c.translate(
                center_x + Math.cos(_startRadius + awardRadius / 2) * text_radius,
                center_y + Math.sin(_startRadius + awardRadius / 2) * text_radius,
            )
            c.rotate(_startRadius + awardRadius / 2 + Math.PI /2)
            c.fillText(awards[i].text, -c.measureText(awards[i]).width / 2 ,0)
            c.restore()
        }else {
                //绘制文字
                c.save()
                c.font = ''
                c.fillStyle = '#ffffff'
                c.translate(
                    center_x + Math.cos(_startRadius + awardRadius / 2) * text_radius,
                    center_y + Math.sin(_startRadius + awardRadius / 2) * text_radius,
                )
                c.rotate(_startRadius + awardRadius / 2 + Math.PI /2)
                c.fillText(awards[i], -c.measureText(awards[i]).width / 2 ,0)
                c.restore()
        }
    } 
}  

function rotateWheel() {
    spinningTime += 20
    if(spinningTime >= spinTotalTime) {
        getValue()
        console.log(getValue())
        return 
    }
    let _spinningChange = (spinningChange - easeOut(spinningTime, 0 , spinningChange,spinTotalTime)) * (Math.PI / 180)
    startRadius += _spinningChange

    drawRouletteWheel()
    window.requestAnimationFrame(rotateWheel)
}

//结束时获取对应奖品值
function getValue() {
    let startAngle = startRadius *180 /Math.PI      //弧度转为角度
    let awardAngle = awardRadius *180 / Math.PI     

    let ponitAngle = 90     //指针所指向的区域的度数， 该值控制选取哪个角度的值
    let overAngle = (startAngle + ponitAngle ) % 360    //无论转盘旋转了多少圈 产生了多达的任意角 只需要求当前位起始角在360度内的角度值
    let restAngle = 360 - overAngle //360减去已旋转的角度值 就是剩下的角度值

    let index = Math.floor(restAngle / awardAngle) //剩下的角度值除以每一个奖品的角度值 就能得到是第几个奖品
 
    return awards[index]
}

window.onload = function(){
    drawRouletteWheel()
}

document.getElementById('spinBtn').addEventListener('click', function(){
    spinningTime = 0
    spinTotalTime = Math.random() * 3 + duration    //随机一个时间总量
    spinningChange = Math.random() * 10 +velocity   //随机一个旋转熟虑
    rotateWheel()
})

/**
 * 在一开始绘制的时候 因为绘制了与奖品个数相同的圆弧 但这些圆弧之间没有联系 是一个个单独的路径
 * 所以填充时 也只会填充路径一端到另一端区间内的空间
 */