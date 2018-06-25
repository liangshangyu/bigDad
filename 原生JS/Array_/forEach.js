//forEach 函数没有返回值，
function forEach(array, func) {
	for(var i = 0,len =array.length;i<len;i++){
		func(array[i]);
	}
}