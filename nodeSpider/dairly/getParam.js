function getParam() {
    let key;
    let value;
    let url = location.href
    let index = url.indexOf('?')
    let str = url.substr(index+1)
    let arr = str.split('&')
    for(var i =0;i<arr.length;i++) {
        index = arr[i].indexOf('=')
        if( index > 0) {
            key = arr[i].substring(0, index)
            value = arr[i].substr(index +1)
            this[key] = value
        }
    }
}

function parseUrl(url){
    var result = [];
    var query = url.split("?")[1];
    var queryArr = query.split("&");
    queryArr.forEach(function(item){
        var obj = {};
        var value = item.split("=")[0];
        var key = item.split("=")[1];
        obj[key] = value;
        result.push(obj);
    });
    return result;
}
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
} 