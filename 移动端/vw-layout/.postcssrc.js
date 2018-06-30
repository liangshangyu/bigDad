// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},  //主要是解决@import引入路径问题
    "postcss-url": {},     //
    "postcss-aspect-ratio-mini":{},  //主要用来处理元素容器宽高比
    "postcss-write-svg":{            //主要用来处理移动端1px的解决方案
      utf8:false
    },
    "postcss-cssnext":{},       //插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理著作权归作者所有。
    "postcss-px-to-viewport":{  //主要是把px单位转化为vw、vh、vmin、vmax，核心插件之一
      viewportWidth:750,   //视口的宽度
      viewportHeight:1334, //视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置。
      unitPrecision:3,     //指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit:'vw',   // 指定需要转换成的视窗单位，建议使用vw
      selectorBlackList:['.ignore','.hairlines'], //指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名著作权归作者所有。
      minPixelValue:1,  // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值著作权归作者所有。
      mediaQuery:false, // 允许在媒体查询中转换`px`
    },
    "postcss-viewport-units":{},
    "cssnano":{                 //主要是用来亚索和清理css代码,cssnano集成了一些其他postcss插件，要禁用的话
      preset:"advanced",
      autoprefixer:false,
      "postcss-zindex":false
    },
    // to edit target browsers: use "browserslist" field in package.json
    //"autoprefixer": {}     //自动处理浏览器前缀
  }
}
