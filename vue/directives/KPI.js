// 悬浮文本
export default {
  inserted (el, binding) {
    if (binding.value) {
      let div = document.createElement('div')
      Object.assign(div.style, {
        position: 'absolute',
        zIndex: 999,
        left: 0,
        top: 0,
        width: '32px',
        height: '32px',
        background: 'url(../../../static/KPI.png) no-repeat top left'
      })
      el.append(div)
    }
  }
}
