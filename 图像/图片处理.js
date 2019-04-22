/*
一般来说，图片在后端的存储有两种方式
1）将图片一独立的形式存储在服务器的指定文件夹中，
2（将图片转化为二进制，直接存储在数据库的Image类型数据字段中
对于第一种存储方式，前端直接将存储路径赋予src属性
对于第二中方式，前端将其二进制交由blob对象处理，通过blob的API生成临时url赋值给src
* */
/*
* URL--》base64<->blob
* */
function urlToBase64(url){
    return new Promise((resolve, reject) =>{
        let image = new Image()
        image.onload = function () {
            let canvas = document.createElement('canvas')
            canvas.width = ''
            canvas.height = ''
            canvas.getContext('2d').drawImage(image, 0, 0)
            let result = canvas.toDataURL('image/png')
            resolve(res)
            image.setAttribute("crossOrigin", "Anonymous")
            image.src = url
        }
    })
}
