export default {
  update (el, binding) {
    setType(el, binding.value.type)
    setPosition(el, binding.value.position)
  },
  inserted (el, binding) {
    setType(el, binding.value.type)
    setPosition(el, binding.value.position)
  }
}

function setOnlyClass (el, classArr, curClass) {
  classArr.forEach(val => el.classList.remove(val))
  el.classList.add(curClass)
}
function setType (el, type) {
  let typeArr = ['up', 'down', 'horizon']
  if (typeArr.indexOf(type) === -1) return
  setOnlyClass(el, typeArr, type + '-arrow')
}
function setPosition (el, position) {
  let posArr = ['left', 'right', 'middle']
  if (posArr.indexOf(position) === -1) return
  setOnlyClass(el, posArr, position)
}
