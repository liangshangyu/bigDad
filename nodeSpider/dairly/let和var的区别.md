1. var声明的变量，其作用域为该语句所在函数内，并且存在变量提升
2. let声明的变量，其作用域在该语句的代码块内，不存在变量提升，在变量声明之前使用会报错
3. let不允许重复声明
es5是函数作用域，即一个函数里面才是一个作用域，es6是块级作用域（花括号{}即使一个作用域）
如if、for

4. let 有暂时性死区
```javascript
if(true) {
    tmp = 'abc';
    console.log(tmp); //ReferenceError
    
    let tmp;
    console.log(tmp); //undefined
    
    tmp = 123;
    console.log(tmp);  //123
}
```

