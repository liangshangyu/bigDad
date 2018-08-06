export default class BaseChart {
  constructor (el, data) {
    this.el = el
    this.data = data
  }

  resetData (data, op) {
    this.el.innerHTML = ''
    this.data = data
    this.draw(op || this.op)
  }

  resize () {}

  clean () {
    this.el.innerHTML = ''
  }
}
