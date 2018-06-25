## vue双向绑定
    在数据渲染的时候使用prop渲染数据 将prop绑定到子组件自身的数据上
    修改数据时更新自身数据来替代prop，watch子组件自身数据的改变，触发事件通知
    父组件更新绑定到prop的数据
###深入
    涉及 Object.defineProperty()的setter getter劫持对象的复制过程