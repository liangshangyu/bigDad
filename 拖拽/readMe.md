##JS可以是先原生拖拽，也可以使用H5的拖拽属性
### H5拖拽属性有一下
1. 被拖动的源对象
    1.1 ondragstart:开始被拖动
    1.2 ondrag: 被拖动过程中
    1.3 ondragend: （源对象）拖动结束
2. 目标元素
    2.1 ondragenter: 拖入目标
    2.1 ondragover: 在目标对象悬停
    2.3 ondragleave: 源对象被拖离开目标对象
    2.4 ondrop: 源对象在目标对象上释放/松手

## 如何在拖动的源对象事件个目标对象事件之间传递数据
H5为所有的拖动相关事件提供了一个新的属性
e.dataTransfer()

### 源对象上的事件处理中保存数据：
e.dataTransfer.setData(k,v);

###目标对象上事件中读取数据
e.dataTransfer.getData(k);