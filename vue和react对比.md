##关于Vue和React区别的一些笔记
###监听数据变化的原理不同
1. vue通过getter/setter以及一些函数的劫持，精确知道数据变化
2. react默认通过比较引用的方式，如果不进行优化（shouldComponentUpdate）可能导致
不必要的VDOM渲染

react强调的是数据的不可变，vue使用的是可变数据。

###数据流的不同
1. vue默认支持双向绑定，比如组件与DOM之间可以通过v-model双向绑定
2. react从诞生之初就不支持双向绑定，React一直倡导的是单向数据流，onChange/setState()

###高阶组件和mixins
1. 在vue中对不同功能组合的方式是通过mixin
2. 在react中则是通过高阶组件的形式
因为vue组件是一被包装的函数，并不简单是我们定义组件时候传入的对象或函数；
定义的模板怎么样被编译？声明的props怎么样被接受？都是vue创建组件实例的时候
隐式做的。而react组件就是一个纯函数

###组件之间的通信
在vue中有三种方式可以实现组件之间的通信
1. 父组件通过props向子组件传递数据或者回调，虽然可以传回调，但是一般只传数据
，而通过事件的机制来处理子组件向父组件的通信
2. 子组件通过事件 向父组件发送消息
3. vue2.0中新增provide/inject来实现组件向子组件注入数据

在react中
1. 父组件通过props向子组件传递数据或回调
2. 通过context进行跨级的通信

###模板渲染方式不同
在表层上，模板的语法不同
1. React通过JSX语法渲染模板
2. Vue通过一种拓展的HTML语法进行渲染

在深层上，模板原理不同
1. React是在组件JS代码中通过原声JS实现模板中的常见语法，比如插值，条件，循环等
2. Vue是在和组件JS代码分离的单独的模板中，通过指令来实现的

react中render函数是支持闭包特性的，所以import的组件在render中可以直接调用
而Vue，由于模板中使用的数据必须挂在this上进行一次中转，所以import的组件必须
在components中声明下，

### Vuex和Redux的区别
从表层上说，store的注入有些区别
在Vux中，$store被直接注入到了组件实例中，因此可以比较灵活的使用：
1. 使用dispatch和commit提交更新
2. 通过mapState或者直接使用this.$store来读取数据

在Redux中，每一个组件都需要显示用connect把需要的props和dispatch连接起来
另外Vuex更加灵活一些，组件中既可以dispatch action也可以commit updates，
而Redux只能进行dispatch不可以直接调用reducer进行修改

从实现原理
1. Redux 使用的是不可变数据，而Vuex的数据是可变的。
   Redux每次都是用新的state替换旧的state，而Vuex是直接修改
2. Redux 在检测数据变化的时候，是通过 diff 的方式比较差异的，而Vuex其实和Vue的原理一样，是通过
   getter/setter来比较的
