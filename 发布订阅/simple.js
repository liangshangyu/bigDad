var Event = (function() {
	var eventList = {};
	var on,
		emit,
		remove;
	on = function(key, fn) {	//listen
		if(!eventList[key]){
			eventList[key] = []
		}
		eventList[key].push(fn);
	};

	emit = function () {    //trigger
		var key = [].shift.call(arguments);
		var fns = eventList[key];

		if(!fns || fns.length === 0){
			return false;
		}
		for(var i =0, fn, fn = fns[i++]){
			fn.applay(this, arguments);
		}
	};

	remove = function(key, fn) {
		var fns = eventList[key];
		
		//key 对应的消息没有人订阅
		if(!fns){
			return false;
		}

		if(!fn){  //没有传入具体的回调函数，表示取消key对应的所有订阅
			fns && (fns.length = 0);
		}else {   //反向遍历
			for(var i = fans.length -1;i>=0;i--){
				var _fn = fns[i];
				if(_fn === fn){
					fns.splice(i,1)
				}
			}
		}
	};

	return {
		on:on,
		emit:emit,
		remove:remove
	}	
}())

login.on("click",function() {
	var name = $('.username').val().trim;
	http.login(name)
		.then((data) => {
			Event.emit('login',data)
		})
})

var header = (function() {
	Event.on('login',function(data) {
			
	})
})()