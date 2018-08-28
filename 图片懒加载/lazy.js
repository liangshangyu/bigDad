let img = document.getElementsByTagName('img');
//设置每次遍历的起始图片 防止重复加载
let n = 0
//加载可是区域图片
lazyLoad()
//window.onscroll = lazyLoad
function lazyLoad() {
    let seeHeight = document.documentElement.clientHeight
    let scrollHeight = document.body.scrollHeight
    for(let i=n;i< img.length;i++){
        if(img[i].src === 'default.png'){
            if(img[i].offsetHeight < seeHeight + scrollHeight){
                img[i].setAttribute('src',img[i].getAttribute('data-src'))
                n++
            }
        }
    }
}

//防抖
function debounce (fn,wait) {
    let timeout = null
    return function () {
        let context = this
        let args = arguments
        clearTimeout(timeout)
        timeout = setTimeout(function(){
            fn.apply(context,args)
        },wait)
    }
}
window.addEventListener('scroll',debounce(lazyLoad,800))

//节流
function throttle (fn,wait,mustTime){
    let timeout = null
    let startTime = new Date()
    let curTime
    return function(){
        let context = this
        let args = arguments
        curTime = new Date()
        if((curTime - startTime) >= mustTime){
            startTime = curTime
            fn.apply(context,args)
            clearTimeout(timeout)
        }else{
            clearTimeout(timeout)
            timeout = setTimeout(function(){
                fn.apply(context,args)
                startTime = new Date()
            },wait)
        }
    }
}