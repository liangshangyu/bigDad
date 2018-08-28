#React组件的更新方式
 React组件的更新由组件状态改变引起，这里的状态一般指组件内的State对象，当组件的
 state改变时候，组件在更新的时候会经历如下过程
 * shouldComponentUpdate
 * componentWillUpdate
 * render()
 * componentDidUpdate
 
 state的更新一般是通过组建内部执行this.setState操作，但是setState是异步的，它
 只是执行将要修改的状态放在一个执行队列中，React会处于性能考虑，把多个setState合并
 成一个执行
 
 ##props的改变
  除了state的更新会导致组件渲染外，外部传来的props也会哦，
  ```javascript
    render() {
    return <span>{this.props.text}</span>
    }
```
当组件更新时，子组件会渲染更新 其运行顺序是
* componentWillReceiveProps(nextProps)
* static getDerivedStateFromProps()
* shouldComponentWillUpdate
* componentWillUpdate
* render
* getSnapshotBeforeUpdate()
* componentDidUpdate

##state的间接改变
 还有一种是将props转换成state来渲染组件的，这时候如果props更新了，要是组件
 重新渲染，就需要在componentWillReceiveProps生命周期中将最新的props赋值给state
 ```javascript
class Example extends React.PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            text: props.text
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({text:nextProps.text})
    }
    render() {
        return <div>{this.state.text}</div>
    }
}
```

##React组件的更新过程

###PureComponent的浅比较
基于上面的问题，所以react又推出了pureComponent，和他类似功能的是pureRenderMixin
插件，主要是执行了一次线比较
```javascript
function shallowCompare(instance, nextProps, nextState){
    return (
        !shallowEqual(instance.props, nextProps) || 
        !shallowEqual(instance.state, nextState)
    )
}
```

PureComponent判断是否需要更新的逻辑和PureRenderMixin一样

```javascript
if(this._compositeType === CompositeTypes.pureClass){
    shouldUpdate = 
    !shallowEqual(prevProps, nextProps) || 
    !shallowEqual(inst.state, nextState)
}
```

###但是如果data是引用数据类型的话，浅比较就不行了
要解决这个问题，就要考虑怎么实现更新后的引用数据和原数据指向的内存不一致
也就是Immutable数据

1. 使用lodash的深拷贝
```javascript
import _ from 'lodash';
const data = {
    list: [{
        name:'',
        sex:''
    },{
        name:'',
        sex:''
    }],
    status:true
}
const newData = _.cloneDeepWith(data)
shallowEqual(data, newData) //false

```
这种方法是先深拷贝复杂类型，然后更改其中的某项，这样两者使用的是不同的引用地址
缺点是这种深拷贝的实现会耗费很多内存

###使用JSON.stringify()
黑魔法
```javascript
const data = {
    list:[
        {
            name:'',
            sex:''
        },
        {
            name:'',
            sex:''
        }
    ],
    status:true,
    c:function() {
        console.log(666);
    }
}
const newData = JSON.parse(JSON.stringify(data))
shallowEqual(data, newData)  //false

//更改其中的某个字段在比较
newData.list[0].name = 'lsy'
shallowEqual(data, newData)  //false
```
缺点：无法拷贝函数

###使用Object解构
```javascript
const data = {
    list:[
        {
            
        },
        {
            
        }
    ],
    status:true
}
const newData = {...data}
console.log(shallowEqual(data,newData))  //false

//修改复杂类型的某个字段
newData.list[0].name = 'lsy'
console.log(shallowEqual(data,newData))  //true
```
缺点：当修改数据中的简单类型的变量时，使用结构复制是可以解决问题的但是
当修改
