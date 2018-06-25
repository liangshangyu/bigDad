/**
 * Created by 17073565 on 2018/5/22.
 */

//获取页面的dom节点数
const getChild = (node) => {
    return Array.from(node.children).reduce((acc, cur) =>
        cur.children.length
        ? acc.concat(cur, getChild(cur))
        : acc.concat(cur),[])
}


//遍历一颗DOM树
const getDomStructure = (node) => {
    //没有子节点 直接返回
    if (!node.children.length) {
        return [node.tagName]
    }
    const arr = []
    //void function 调用函数，忽略返回值
    void function fn(d, t) {
        Array.from(d.children).forEach(n => {
            const _t = t ? `${t} - ${n.tagName}`: `${d.tagName} -> ${n.tagName}`
            if (n.children.length) {
                f(n, _t)
            }else {
                arr.push(_t)
            }
        })
    }(node)

    return arr;
}

//求dom树的最大深度, 递归一次就说明向下走了一层  记录最大值 比较  结束后返回
const getDomDepth = (node) => {
    let max =1;
    void function fn(d,m) {
        m++;
        Array.from(d.children).forEach(n => {
            if(n.children.length) {
                fn(n,m)
            }else {
                if(max < m) max = m
            }
        })
    }(node,1)

    return max
}