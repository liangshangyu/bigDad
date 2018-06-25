//ios input不能自动聚焦
//一般正常浏览器上 可以用js来focus 到一个输入框上
var elem = document.getElementById('inputElement');
elem.focus();

//但是在IOS手机上 这样的代码根本不起作用 只有在监听了用户发出的事件是函数中执行focus才会有用
var button = document.getElementById('btn');
var inputElem = document.getElementById('input-elem');
button.addEventListener('click',function(e) {
	inputElem.focus();
});

