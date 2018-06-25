/**
 * Created by 17073565 on 2018/5/22.
 */
function getSpecItem(arr, target){
    const stack = [];
    const result = []
    arr.sort((a,b) => b - a)

    let index=0,oldIndex;
    while (true) {
        const sum = stack.reduce((prev,cur) => prev + cur.value, 0);
        if(sum > target){
            if(sum === target) {
                result.push(stack.map(x => x.value))
            }
            do {
                index = stack.pop().index +1
            }while (index >= arr.length);
        }
        stack.push({ index, value: arr[index] });
        if(index >= arr.length) {
            index = stack[0].index;
            if (index === arr.length -1) return result
            stack.length = 0
        }
        ++index;
    }
}
getSpecItem([1, 2, 3, 5, 7], 8);