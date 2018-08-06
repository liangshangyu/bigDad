export default class BaseChart {
  constructor (el, data) {
    this.el = el
    this.data = data
  }

  resetData (data) {
    this.el.innerHTML = ''
    this.data = data
    this.draw(this.op)
  }

  resize () {}

  clean () {
    this.el.innerHTML = ''
  }
}
