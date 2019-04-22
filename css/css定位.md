###css定位
position:可取值有 static relative absolute fixed
1. static（静态定位）对象遵循标准文档流，top bottom left right等属性失效
2. relative(相对定位) 对象遵循标准文档流 依赖top bottom left right等属性相对于该对象在标准文档流中的位置进行偏移，可以
    通过z-index定义层级关系
3. absolute(绝对定位) 对象脱离文档流，使用top bottom left right等属性进行绝对定位，相对于static定位以外的第一个父元素
    进行定位，可以通过z-index定义层级关系
4. fixed(固定定位)对象脱离文档流，使用top bottom left right等属性进行绝对定位，相对于浏览器窗口进行定位，可以通过z-index定义层级关系

##标准文档流
指在不使用其他与排列和定位相关的特殊CSS规则时，元素的默认排列规则
HTML文档中的元素可以分为两大类：行内元素和块级元素。 
1.行内元素，是DOM树中的一个节点。不占据单独的空间，依附于块级元素，行内元素没有自己的区域。

2.块级元素，是DOM树中的一个节点。总是以块的形式表现出来，并且跟同级的兄弟块依次竖直排列，左右自动伸展，直到包含它的元素的边界，在水平方向不能并排。

盒子在标准流中的定位原则： 
margin控制的是盒子与盒子之间的距离，padding存在于盒子的内部它不涉及与其他盒子之间的关系和相互影响问题，因此要精确控制盒子的位置，就必须对margin有更深入的了解。 
（1）行内元素之间的水平margin 
当两个行内元素紧邻时，它们之间的距离为第一个元素的右margin加上第二元素的左margin。 （2）块级元素之间的竖直margin 
两个竖直排列的块级元素，它们之间的垂直距离不是上边的第一个元素的下margin和第二个元素的上margin的总和，而是两者中的较大者。这在实际制作网页的时候要特别注意。 
（3）嵌套盒子之间的margin 
这时子块的margin以父块的content为参考进行排列。 
（4）margin设为负值 
会使设为负数的块向相反的方向移动，甚至会覆盖在另外的块上。

###relative
仅设置top bottom left right属性不会改变原本在文档流中的占位空间
但是margin会，padding

###absolute
由图五可见，绝对定位脱离标准文档流，相对于static定位以外的第一个父元素，
使用left,top（或right,bottom)进行绝对定位。值得一提的是在使用absolute定位时，
必须指定left,top,right,bottom中的至少一个（否则left/right/top/bottom属性会使用它们的默认值 auto ，
这将导致对象遵从标准文档流，在前一个对象之后立即被呈递，
简单讲就是都变成relative，会占用文档空间）。
如果同时设置了left/right 属性，那么left生效。同理top/bottom同时存在时，top生效。
