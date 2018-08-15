function getMaxSumChildArr(arr){
    if(Array.isArray(arr) || Object.prototype.toString.call(arr) === '[object Array]'){
        var length = arr.length;
        if(length === 1){
            return arr
        }
        var slice = Array.prototype.slice;

        //start, end采用的是左闭右开 [start,end)
        function getMaxArr(arr,start,end) {
            if(end - start == 1){
                var output = {
                    arr:[arr[start]],
                    sum:arr[start]
                };
                return output
            }
            //var leftOutput, rightOutput, centerOutput;
            var center = Math.floor((start + end) / 2)

            //前半段处理
            var leftOutput = getMaxArr(arr, start, center)
            var rightOutput = getMaxArr(arr,center,end)

            //中间段
            var centerMaxSum,
                tmpSum = 0,
                tmpMax = -Infinity,
                centerIndexLeft,
                centerIndexRight;

            //从前半段最后一个元素向前， 逐个相加获取“和最大”的值以及最小数组下标
            for(var i=center -1;i>=0;i--){
                tmpSum += arr[i]
                if(tmpSum >= tmpMax){
                    tmpMax = tmpSum;
                    centerIndexLeft = i;
                }
            }

            //保存上一部的最大值，并清空临时变量
            centerMaxSum = tmpMax
            tmpSum = 0
            tmpMax = -Infinity

            //从后半段第一个元素向后， 逐个相加获取“和最大”的值和最大数组下标
            for(var i=center;i<length;i++){
                tmpSum += arr[i]
                if(tmpSum >= tmpMax){
                    tmpMax = tmpSum;
                    centerIndexRight = i;
                }
            }
            centerMaxSum += tmpMax;
            centerOutput = {
                arr: slice.call(arr, centerIndexLeft,centerIndexRight + 1),
                sum: centerMaxSum
            }

            //对三段做比较
            var output = leftOutput.sum > rightOutput.sum ? leftOutput : rightOutput;
            output = output.sum > centerOutput.sum ? output : centerOutput
            return output
        }
        var output = getMaxArr(arr, 0,length)
        return output.arr
    }
    return []
}

var testArr = [-1,-3,4,6,-4];
console.log(getMaxSumChildArr(testArr));
