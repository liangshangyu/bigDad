import WaterMark from '../chart/WaterMark.js'
import { useInfor } from '../rule'

export default {
  inserted (el, binding) {
    let timer = setInterval(() => {
      if (useInfor.data.userNm && useInfor.data.userCd) {
        let wMark = new WaterMark(useInfor.data.userNm, useInfor.data.userCd)
        let imageSrc = wMark.draw()
        if (binding.value && binding.value === false) return
        el.style.background = `#fff url(${imageSrc}) repeat top left`
        clearInterval(timer)
      }
    }, 50)
  }
}
