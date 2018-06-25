/**
 * 带有算法思想的快排
 * 快排的原理就是找一个基准值，通常是中间值，然后分别从第一个递增和最后一个递减，i j
 * 找到arr[i] 大于基准值   arr[j]小于基准值
 * 调换ij
 * 循环
 */
function quick(array, left, right) {
    let index;
    if(array.length > 1) {
        index = partition(array,left, right);
        if(left < index -1) {
            quick(array, left, index - 1)
        }
        if(index < right ) {
            quick(array, index, right)
        }
    }
    return array
}

function quickSort(array) {
    return quick(array, 0, array.length-1)
}

//实现划分操作 找到基准值
function partition(array, left, right) {
    const pivot = array[Math.floor((right + left) / 2)]
    let i = left;
    let j = right;
    while(i <= j) {
        while (compare(array[i], pivot) === -1) {
            i++
        }
        while (compare(array[j], pivot) === 1) {
            j--;
        }
        if(i <= j){
            swap(array, i, j);
            i++;
            j--
        }
    }
    return i
}

function compare(a, b) {
    if(a===b) {
        return 0
    }
    return a < b ? -1 : 1
}
function swap(array, a, b) {
    [array[a], array[b]] = [array[b], array[a]]
}

const arr = [];

// 生成随机整数
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 生成len长度的随机数组
function generateArr(len) {
    for (var i = 0; i < len; i++) {
        arr.push(random(1, len));
    }
}

generateArr(100)
console.log(quickSort(arr));