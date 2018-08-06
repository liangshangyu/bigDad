import WaterMark from ''
import { userInfo } from '../rule'
export default {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
	inserted (el, binding) {
		let timer = setInterval(() => {
			if(userInfo.data.userNm && userInfo.data.userCd){
				let wMark = new WaterMark(userInfo.data.userNm,userInfo.data.userCd)
				let imageSrc = wMark.draw()
				if(binding.value && binding.value === false) return
				el.style.background = `#fff url(${imageSrc}) repeat top left`
				clearInsterval(timer)
			}
		},50)
	}
}