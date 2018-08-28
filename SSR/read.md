##简介

### app.js
app.js是我们的通用entry，他的作用是构建一个vue的实例以供服务端和客户端
使用，注意，在纯客户端的程序中app.js将会挂载实例到dom中，ssr中这一部分
的功能放到Client entry中去做了

###两个entry
接下来来看Client entry 和 Server entry,分别是客户端的入口和服务端的入口。
Client entry的功能很简单，就是挂在我们的Vue实例到指定元素上；Server entry
是一个使用export导出的函数。主要负责调用组件内定义的获取数据的方法，获取到
SSR渲染所需要的数据，并存储到上下文环境中，这个函数会在每一次的渲染中重复的调用

###webpack打包构建
然后我们的服务端代码和客户端代码通过webpack分别打包，生成Server Bundle和
Client Bundle，前者会运行在服务器上通过node生成预渲染的HTML字符串，发送
到我们的客户端以便完成初始化渲染；而客户端Bundle就自由了，初始化渲染完全不以啦
它。客户端拿到服务端返回的HTML字符串后，会去“激活”这些静态HTML，是其变成由Vue
动态管理的DOM，以便响应后续数据的变化

