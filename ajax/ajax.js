//ajax创建
/*1. 创建XMLHttpRequest对象
* ajax的核心是XMLHttpRequest对象 是ajax实现的关键，发送异步请求、接受
* 响应以及执行回调
* */

var xhr = new XMLHttpRequest();
function createRequest() {
    try {
        xhr = new XMLHttpRequest();
    }catch (tryMS) {
        try {
            xhr = new ActiveXObject('Msxml2.XMLHTTP');
        }catch (otherMS) {
            try  {
                xhr = new ActiveXObject("Microsoft.XMLHTTP")
            }catch (failed) {
                xhr = null
            }
        }
    }
    return xhr
}

//2. 准备请求
xhr.open(method,url,async)
/*
* 第一个参数表示请求的类型 GET POST
* 第三个参数表示异步还是同步 默认是true
*   false 同步模拟发出的请求 会暂停所有的js代码执行
*   true  异步模拟发出请求
* */

//3. send  GET的方法将要提交的参数写到open的url 参数中，此时send方法参数为null


//4. 处理响应
xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status == 200){

    }
}
/*
* onreadyStateChange: 处理过程发生变化的时候执行下面的函数
* readyState: ajax处理过程
*   0：请求未初始化（还没有调用open）
*   1: 请求已建立 但是还没发送 （还没调用send）
*   2：请求已发送 正在处理中（已获取响应头 从响应中获取内容头部）
*   3：请求处理中 通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
*   4：响应已完成
*
* responseText: 获取字符串形式的响应数据
* */

function ajax(url, success, fail) {
    //1 创建连接
    var xhr = new XMLHttpRequest();
    //2 连接服务器
    xhr.open('get', url, true);
    //3 发送请求
    xhr.send(null);
    //4 请求接受
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200){
            success()
        }else {
            fail()
        }
    }
}

//jQuery 中的ajax
var btn = document.getElementsByTagName('input')[0]
btn.onclick = function (){
    ajax({

    })
}

function ajax(aJson){
    var xhr = null;
    var type = aJson.type || 'get'
    var asyn = aJson.asyn || true
    var url = aJson.url
    var success = aJson.success
    var data = aJson.data || ''

    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    }else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP")
    }

    if(type == 'get' && data){
        url += '/?' + data + '&' + Math.random()
    }

    xhr.open(type, url, asyn)
    xhr.setRequestHeader('content-type','application/x-www-form-urlencode')
    type == 'get'? xhr.send(): xhr.send(aJson.data)

    xhr.onreadystatechange = function() {
        if(xhr.readState == 4){

            if (xhr.status == 200 && xhr.status<300) {
                //请求成功处理数据
                success && success(xhr.responseText);
            }else{
                alert("请求出错"+xhr.status);

            }
        }

    }
}
