 ##Service Worker
 Service Worker提供了一种能力，可以fetch请求资源，然后Service Worker中进行编译或转化，
 返回处理后的其他资源，这种特性可以用来实现各种资源的在线客户端编译。
 
 ###一、Service Worker与直接数据和HTML模板渲染页面
 现在很多页面是基于NODE.js直接渲染处处的，以实现完全的前后端分离，而这种渲染本质上
 还是在服务端进行，只是渲染的语言是JS。
 实际上，有了Service Worker我们可以直接在客户端也就是浏览器里面直接进行渲染。
 
 例如
 ```html
<ul>
<li></li>
<li></li>
<li></li>
</ul>
<% for(var i=0;i<goods.length;i++){%>
<%if(goods[i].num == 0){%>
    <ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
  <%}else {%>
    <ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
  <%}%>
<%}%>
```
渲染之后
```html
<ul>
<li></li>
<li></li>
<li></li>
</ul> 
```
原因：就是Service Worker再背后做了HTML的数据渲染
首先，注册Service Worker
```javascript
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw-reader.js',{
        scope:'./'
    })
}
```
关键是sw-reader.js 主要做了两件事：
1. 内置极简模板渲染引擎， 采用的是老版的artTemplate
2. 捕获.html请求，并对获取到的HTML字符串内容进行模板渲染，并返回输出。完成JS代码如下
```javascript
    self.addEventListener('fetch',function(event){
        event.respondWith(async function(){
            if(/\.html/.test(event.request.url)){
                let res = await fetch(event.request)
                let text = await res.text()
                
                var data = {}
                text = text.replace(/([\w\W]*?])<\/script>/,function(matches,$1){
                    //获取页面渲染的json数据
                    data = JSON.parse($1)
                    return ''
                });
                
                //模板text和数据data进行渲染并重新返回给浏览器
                return new Response(template.compile(text)(data), {
                    headers: {
                        'content-type':'text/html; charset=utf-8'
                    }
                })
            }
            return fetch(event.request)
        }())
    })
```
上面代码中，text是原始html代码，而在Service Worker中返回的是template.compile(text)(data)
渲染后的HTML代码；将页面需要的JSON数据放在模板页面头部使用
```javascript
<script type="text/json">   
````
进行标识。sw-reader.js中就是匹配其来获取json数据的。当然你也可以使用其他标识，例如
$$${
}$$$

### 二：Service Worker与浏览器直接编译CSS
对于CSS的一些预编译工具，如Less Stylus都是可以使用JS进行编译的，而这些编译工具都是
有web版的，因此，理论上是可以把Less Stylus的编译直接在浏览器中，Service Worker中编译成css
并返回。
但是，问题在于Less web版解析器体积较大。

```javascript
var qcss = function(){}
self.addEventListener('fetch',function(event){
    event.respondWith(async function(){
        if(/\.qcss/.test(event.request.url)){
            let res = await fetch(event.request)
            let text = await res.text()
            return new Response(qcss(text), {
                headers:{
                    'content-type':'text/css; charset= utf-8'
                }
            })
        }
        return fetch(event.request)
    }())
})
```



