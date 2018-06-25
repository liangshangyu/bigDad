/**
 * Created by 17073565 on 2018/5/22.
 */
function format(str,obj) {
    return str.replace(/\$\{([^{]+)\}/gm, (match, name) => name ? obj[name] : '');
}
format('hello ${name}', {name:'world'})

//去除空格
' fdsf '.replace(/^\s*/, '').replace(/\s*$/, '')