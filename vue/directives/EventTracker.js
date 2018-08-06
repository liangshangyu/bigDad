export default {
  inserted (el, binding) {
    el.addEventListener('click', function () {
      console.log(window.sa)
      try {
        window._ssa.click.sendDatasIndex(this)
        /**
        * 也可以使用下边的函数，以覆盖默认选项name，title，toUrl的值
        * {_saName} 自定义属性名称，本属性名的值会取代name属性值
        * {_saTitle} 自定义属性名称，本属性名的值会取代title属性值
        * {currentUrl} 自定义当前页面的连接
        * sa.click.sendDatasIndex(this, {_saName}, {_saTitle}, {currentUrl})
        *
        * 例如：<label name="点击" saName="点我" />
        * sa.click.sendDatasIndex(this, 'saName')
        * 采集的内容是saName="点我" 而非 name="点击"
        */
      } catch (e) {}
    })
  }
}
