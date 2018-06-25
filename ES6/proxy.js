/**
 * Created by 17073565 on 2018/5/8.
 */
/**
 * new Proxy(target, handler)
 * target 拦截对象  handler 定制拦截行为
 * */

//实现读取索引为负的数组值
function createArray(...elements) {
    let handler = {
        get(target, propKey, receiver) {
            console.log(propKey);
            let index = Number(propKey)
            console.log(index);
            if (index < 0){
                propKey = String(target.length + index)
            }
            console.log(propKey);
            return Reflect.get(target, propKey, handler)
        }
    }
    let target = []
    target.push(...elements)
    console.log(target);
    return new Proxy(target, handler)
}
let arr = createArray('a','b','c')
console.log(arr[-1]);

//
const dom = new Proxy({},{
    get(target, property) {
        return function (attrs = {}, ...children) {
            const el = document.createElement(property);
            for (let prop of Object.keys(attrs)) {
                el.setAttribute(prop, attrs[prop])
            }
            for(let child of children) {
                if(typeof child === 'string'){
                    child = document.createTextNode(child)
                }
                el.appendChild(child)
            }
            return el
        }
    }
})
const el = dom.div({},
    'Hello, my name is ',
    dom.a({href:''}),
    '. i like',
    dom.ul({},
        dom.li({}, 'The web'),
        dom.li({},'food'),
        dom.li({},'')
    )
)
document.body.appendChild(el)


//get 第三个参数 receiver 总是为当前Proxy的实例
