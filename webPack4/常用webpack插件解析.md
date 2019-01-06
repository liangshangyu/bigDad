##html-webpack-plugin
build文件夹会生成一个index.html文件和一个bundle.js文件，并且html文件会自动引用webpack
生成的bundle.js文件所有的这些都是html-webpack-plugin的功劳。帮我们生成一个html文件，并且
引入相关的assets文件 比如（css，js）

###可配置项
1. title  设置生成html文件的标题
2. filename  生成html文件的文件名
3. template  根据自己的指定的模板文件生成特定的html文件。这里的，模板类型可以是任意你喜欢的
              html jade ejs等。需要安装对应的loader  
4. inject     注入选项 有四个选项值 
              true：默认值 script标签位于html文件的body底部
              body：同上
              head：script位于head标签内部
              false：不插入生成是js文件 只是单纯的html文件
 
5. favicon    给生成的html文件favicon 属性值是favicon所在路径
6. minify     作用是对html文件进行压缩，属性值是一个压缩选项或者是false。默认值是false７
7. hash       给生成的js文件一个独特的hash值。默认是false
8. chunks     该选项主要是针对多入口文件。当你有多个入口文件时，对应就会生成多个js文件
               那么chunks就是决定是否都引入这些生成是js文件。默认是引用
               
                
                            