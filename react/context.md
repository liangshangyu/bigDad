##使用context步骤
1. 在顶层组件通过childContextTypes规定数据类型
2. 在顶层组件中通过getChildContext设置数据
3. 在后代组件中通过contextTypes规定数据类型
4. 在后代组件中通过context参数获取数据

```javascrip
//App.js
import PropTypes from 'prop-types'
...
export default class App extends Component {
    static childContextTypes = {
        store: PropTypes.object
    }
    getChildContext() {
        const state = {
            head:'我是全局head',
            body:'我是全局body',
            headBtn:'修改head',
            bodyBtn:'修改body'
        }
        return {store:state}
    }
    render (){
        ...
    }
}


//Head.js
import React,{} from 'react'
import PropTypes from 'prop-types'
export default class Head extends Component{
    static contextTypes = {
        store:PropTypes.object
    }
    contructor(props){
        super(props);
        this.state = {}
    }
    componentWillMount() {
        this._upState();
    }
    _upState() {
        const { store } = this.context
        this.setState({
                ...store
            })
    }
    render () {
        <div className='head'>{this.state.head}</div>
    }
}
//body.js
import React,{Component} from 'react'
import PropTypes from 'prop-types'
export default class Body extends Component{
    static contextTypes = {
        store:PropTypes.object
    }
    contructor(props){
        super(props)
        this.state = {}
    }
    componentWillMount() {
        this._upState()
    }
    _upState () {
        const {store} = this.context
        this.setState({
               ...store
            })
    }
    render () {
        return (
            <div className=''>{this.state.body}</div>
        )
    }
}
```

##结合redux使用
```javascript
export default storeCahnge = (store, action) => {
    switch (action.type) {
        case 'Head':
        return {
            ...store,
        head:action.head
        }
        case 'body':
            return {
                ...store,
                body:action.body
            }
        default:
         return {...store}    
    }

} 
//App.js
import {createStor} from 'redux'
export default class App extends Component{
    static childContextTypes = {
        store:PropTypes.object,
        dispatch:PropTypes.func,
        subscribe:PropTypes.func
    }
    getChildContext() {
        const state = {
            head:'',
            body:'',
            headBtn:'',
            bodyBtn:''
        }
        const {store, dispatch, subscribe} = createStor(state,)
        return { store, dispatch, subscribe}
    }
    render() {
        return (
            <div />
        );
    }
}
//Head.js
export default class Head extends Component{
    static contextTypes = {
        store:PropTypes.object,
        dispatch:PropTypes.func,
        subscribe:PropTypes.func,
        getStore:PropTypes.func
    }
    componentWillMount() {
        const {subscribe} = this.context;
        this._upState();
        subscribe(()=> this._upState())
    }
    _upState() {
        const {getStore} = this.context
        this.setState({
            ...getStore();
        })
    }
}

//在button.js 中修改数据实验
export default class Button extends Component {
    changeContext(type) {
        const { dispatch } = this.context;
        dispatch({
            type:type,
            head:'我是修改后的数据'
        });
    }
    render () {
        return (
            <div>
                <div className='btn' onClick={() => this.changeContext('Head')}>{this.state.headBtn}</div>
            </div>
        )
    }
}

```
使用createStore方法，创建出全局store。并且把store、dispatch、subscribe通过context传递，让各个后代组件都能轻易获取这些全局的属性。

##优化
以上虽然可行，但是有
1. 大量的重复代码
2. 代码几乎不可复用
以上问题可以通过高级组件解决，把重复的代码逻辑封装 ==》 connext
```javascript
//把context相关逻辑都交与connect处理
import React,{Component} from 'react'
import PropTypes from 'prop-types'
export const connect = (Comp,propsType) => {
    class Connect extends Component{
        static contextTypes = {
            store:PropTypes.object,
            dispatch:PropTypes.func,
            subscribe:PropTypes.func,
            getStore:PropTypes.func,
            ...propsType
        }
        contructor(props) {
            super(props)
            this.state ={
                dispatch:() => {}
            }
        }
        componentWillMount() {
            const { subscribe,dispatch } = this.context;
            this.setState({dispatch})
            this._upState()
            subscribe(() => this._upState())
        }
        _upState() {
            const { getStore } = this.context;
            this.setState({
                ...getStore
            })
        }
        render() {
            return (
                <div className='connect'>
                    <Comp {...this.state}/>    
                </div>
            )
        }
    }
    return Connect;
}

//改写head
import React,{} from 'react'
import {connect} from 'redux'
import PropTypes from 'prop-types'
class Head extends Component{
    render() {
        return (
            <div className='head'>{this.props.head}</div>  //改从props中去
        )
    }
}
const propsType = {
    store:PropTypes.object
}
export default connect(Head,propsType);
```
可以看到改造后的Head组件变的非常精简，我们只需要关心具体的业务逻辑，而任何关于context的操作都放在了connect;
但是connect中的proptypes都是写死的，缺乏灵活性，也不利于开发

##从App.js中分离相关注入
但是，在 App.js 中，依旧还有和 context 相关的内容。其实，在 App 中用到 context 只是为了把 store 存放进去，好让后代组件可以从中获取数据。那么，我们完全可以通过容器组件来进行状态提升，把这部分脏活从 App 组件中分离出来，提升到新建的容器组件中。我们只需要给他传入需要存放进 context  的 store 就可以了。
```javascript
//provider
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStore, storeChange } from '../redux';
export class Provider extends Component {
  static childContextTypes = {
    store: PropTypes.object,
    dispatch: PropTypes.func,
    subscribe: PropTypes.func,
    getStore: PropTypes.func
  }
  getChildContext () {
    const state = this.props.store;
    const { store, dispatch, subscribe, getStore } = createStore(state,storeChange)
    return { store, dispatch, subscribe, getStore };
  }
  render(){
    return (
      <div className="provider">{this.props.children}</div>
    );
  }
}

# App.js 
...
export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Head />
        <Body />
      </div>
    );
  }
}

# index.js
...
import { Provider } from './redux'
const state = {
  head: '我是全局 head',
  body: '我是全局 body',
  headBtn: '修改 head',
  bodyBtn: '修改 body'
}
ReactDOM.render(
  <Provider store={state}>
    <App />
  </Provider>, 
  document.getElementById('root')
);
```

我们在index.js中定义了全局store，通过容器组件Provider注入context中，让所有后代组件都可以获取。而在App组件中，只需要关注具体的业务逻辑就好






