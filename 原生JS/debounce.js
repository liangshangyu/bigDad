/**
 * 如果用手指一直按住弹簧，他将不会弹起直到松手
 * 也就是说当调用动作n毫秒后 才会执行该动作  若在这时间内又调用此动作将重新计算执行时间
 *
 * 空闲控制 返回函数连续调用时，空闲时间必须大雨或等于 idle, action 才会执行
 * @param   idle {number}  空闲时间 单位毫秒
 * @param   action {function}  请求关联函数，实际应用需要调用的函数
 * @return  {function}         返回客户调用函数
 *
 * */
debounce(idle, action)
//简单实现
let debounce = function (idle, action) {
    let last
    return function () {
        let ctx = this, args = arguments;
        clearTimeout(last)
        last = setTimeout(function () {
            action.apply(ctx, args)
        }, idle)
    }
}

/**
 * 如果将水龙头拧紧直到是以水滴的形式流出，每隔一段时间就会有水滴流出。
 * 就是说预先设定一个执行周期，当调用动作的时刻大于等于执行周期则执行改该动作
 * 然后进入下一个新周期
 * 接口定义：
 * @param    delay   {number}   延迟时间，单位毫秒
 * @param    action  {function} 请求关联函数，实际应用需要调用的函数
 * @return   {function}         返回客户调用函数
 * */
let throttle = function (delay, action) {
    let last = 0
    return function () {
        let curr = +new Date()
        if(curr - last > delay){
            action.apply(this, arguments)
            last = curr
        }
    }
}

`
 <form>
    <div class="status-key"></div>
    <input type="text" class="autocomplete"/>
    <div class="status-ajax"></div>
</form>
`


$(document).ready(function() {
    let $status = $('.status-key')
    let intervalId;
    let $statusAjax = $('.status-ajax')

    function make_ajax_request(e) {
        let that = this
        $statusAjax.html('that\'s enough waiting.Making now the ajax reques')
        intervalId = setTimeout(function () {
            $status.html('Typing here. I will detect when you stop typing')
            $statusAjax.html('')
            $(that).val('')
        },200)
    }

    $('.autocomplete').on('keydown',function(){
        $status.html('waiting for more keystrokes...');
        clearInterval(intervalId)
    })

    $('.autocomplete').on('keydown', _.debounce(make_ajax_request, 300))
})


let htmlNode = `<div class="item color-1">Block 1</div>
                  <div class="item color-2">Block2</div>  
                  <div class="item color-3">Block 3</div>  
`
$(document).ready(function() {
    //每200ms检查滚动条的位置
    $(document).on('scroll',_.throttle(function(){
        check_if_need_more_content();
    },200))

    function check_if_need_more_content() {
        pixelsFromWindowBottomToBottom = 0 + $(document).height() - $(window).scrollTop() - $(window).height;
        if(pixelsFromWindowBottomToBottom < 200) {
            $('body').append($('.item').clone())
        }
    }
})
