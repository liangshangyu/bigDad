var fruits = ['Apple', 'Banana'];
//遍历数组
fruits.forEach((item, index, array) => {
	
})

//添加元素到数组末尾 源数组改变
fruits.push("Orange"); //返回修改后数组的长度

//删除数组末尾的元素 原数组改变 返回被删除的元素
fruits.pop()

//删除数组第一个元素 返回删除的元素
fruits.shift()

//添加元素到头部  返回长度，原数组改变 
fruits.unshift('Strawberry')

//找出某个元素在数组中的索引 原数组不变
fruits.indexOf('Banana')

//通过索引删除某个元素/添加新元素; 返回被删除元素 原数组改变
fruits.splice(1,1)
//从一个索引位置删除多个元素 m,n 包含索引m在内的n个
fruits.splice(1,2)

//slice方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组；原数组不改变
//复制一个数组  原数组不变
var shalldowCopy = fruits.slice();


//合并数组 原数组不变 返回新的数组
fruits.concat([1,2]);

//连接所有元素组成一个字符串 原数组不变
fruits.join(',')

//将数组中元素的位置颠倒 [1,2,3] => [3,2,1] 原数组改变
fruits.reverse();

//判断是否是数组
fruits.isArray() 





