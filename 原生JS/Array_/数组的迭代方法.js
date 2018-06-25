//为数组中的每一个元素执行一次回调
Array.prototype.forEach()

//返回一个数组迭代器对象，该迭代器会包含所有数组元素的键值对
Array.prototype.entries()

//如果数组的每个元素都满足测试 则返回true，否则返回false
Array.prototype.every()

//如果数组中至少有一个元素满足测试函数，则返回true，否则返回false
Array.prototype.some()

//将所有在过滤函数中返回Ture的数组元素放在一个新的数组中返回
Array.prototype.filter()

//找到第一个满足测试函数的元素并返回那个元素的值，找不到则返回undefined
Array.prototype.find()

//找到第一个满足测试函数的元素并返回那个元素的值，找不到则返回-1
Array.prototype.findIndex()

//返回一个数组迭代器对象，该迭代器会包含所有数组元素的键
Array.prototype.keys()

//返回一个数组迭代器对象 包含所有元素的值
Array.prototype.values()

//返回一个由回调函数的返回值组成的新的数组 原数组不变
Array.prototype.map()

//从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中
//传给下次回调函数，并返回最后一次回调函数的返回值
Array.prototype.reduce()

//从右到左
Array.prototype.reduceRight()
