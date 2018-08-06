export default class WaterMark {
  constructor (userNm, userCd) {
    this.userNm = userNm
    this.userCd = userCd
  }
  draw () {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = 250
    canvas.height = 130
    ctx.translate(canvas.width / 2, canvas.height / 2 - 35)
    ctx.rotate(-Math.PI / 12)
    ctx.font = '700 12px/Mircosoft Yahei'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#eaf0f5'
    // ctx.fillStyle = '#f00'
    ctx.fillText(`罗盘 ${this.userNm} ${this.userCd}`, 0, 0)
    return canvas.toDataURL('image/png')
  }
}
