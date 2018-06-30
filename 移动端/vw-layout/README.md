# vw-layout
Vue-cli默认配置了三个postcss插件，但是要完成vw的布局兼容方案，还需要配置一下几个插件
1. postcss-aspect-ratio-mini
2. postcss-px-to-viewport
3. postcss-write-svg
4. postcss-cssnext
5. cssnano
6. postcss-viewport-units

##接下来在postcssrc.js中配置
由于cssnext 和 cssnano 中都有autoprefixer，所以把默认的删除掉，cssnano中的设置为false

目前出现设计稿，我们都是使用750px的宽度，那么100vw = 750px,即1vw = 7.5px,那么我们可以根据设计图
上的px值直接转换为对应的vw值，在进行撸码的时候，不需要进行任何的计算，直接在代码中写px
在不想px转为vw的元素上添加类名 .ignore或.hairlines(.hairlines一般用于设置border-width:0.5px的元素中)：著作权归作者所有。

### 哪些地方可以使用vw来适配，根据相关测试
1. 容器适配可以使用vw
2. 文本的适配
3. 大于1px的边框 圆角 阴影
4. 内外边距
 
 ## 最终解决方案
 使用viewport的polyfill:Viewport Units Buggyfill. 使用viewport-units-buggyfill有以下几步：
 
 1. 引入JS文件；viewport-units-buggyfill主要有两个JavaScript文件：viewport-units-buggyfill.js和viewport-units-buggyfill.hacks.js。你只需要在你的HTML文件中引入这两个文件。比如在Vue项目中的index.html引入它们
 2.  在HTML文件中调用viewport-units-buggyfill

### content引起的问题
1. img无法显示 --- 解决办法 全局添加 img { content: normal !import}
