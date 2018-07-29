//项目场景
/*
* 搜索页面--》搜索结果页面，结果页面要重新获取数据
* 搜索结果页面--》进入详情页面--》返回页面列表页，要保存上次已经加载的数据和还原上次浏览位置
* */
//在vue2中提供了keep-alive,首先在app.vue中定义keep-alice
<keep-alive>
    <router-view v-if="$route.meta.keepAlive"/>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"/>
//这里根据路由中的meta原信息中的keep-alive字段来判断当前路由组件是否需要缓存

//在router/index.js中定义meta信息,list是搜索结果页面
    {
        path:"/list",
        name:'List',
        component:resolve => require(),
        meta:{
            isUseCache:false,
            keepAlive:true
        }
    }

/*
* 设置了keepAlive的组件
*   第一次进入：beforeRouterEnter => created=> ... => activated=> .. =>deactivated
*   后续进入时：beforeRouterEnter => activated=>deactivated
*
*   可以看到只有第一次进入该组件，才会走created钩子函数，而需要缓存的组件中activated是每次都会走的钩子函数。
*   所以，我们要在这个钩子里面去判断，当前组件是需要使用缓存的数据还是重新刷新获取数据。
*   思路有了，下面我们来实现：
* */
//list组件的activated钩子
activated() {
    //isUseCache为false时才会重新数显获取数据
    //以为list使用keep-alive来缓存组件，所以默认是会使用缓存数据的
    if(!this.$route.meta.isUseCache){
        this.list = []; //清空原有数据
        this.onload(); //这是获取数据是函数
    }
}

/*
* 这里的isUseCache 其实就是我们用来判断是否需要使用缓存数据的字段，
* 我们在list的路由的meta中已经默认设置为false，
* 所以第一次进入list时是获取数据的。
*
* 当我们从详情页返回时，把list页面路由的isUseCache设置为true
* */
//详情页面的beforeRouteLeave钩子函数
beforeRouteLeave(to, from , next) {
    if(to.name == 'list'){
        to.meta.isUseCache = true;
    }
    next()
}

/*
* 我们这里是在即将离开detail页面前判断是否返回的列表页。
* 如果是返回list页面，则把list页面路由的isUseCache字段设置成true。
* 为什么这样设置呢？因为我们对list组件使用的keep-alive进行缓存组件，
* 其默认就是使用缓存的。而我们又在list组件的actived钩子函数中进行了判断：
* 只有在list页面的isUseCache==false时才会清空原有数据并重新获取数据。
* 所以此处设置isUseCache为true，此时返会list页面是不会重新获取数据的，而是使用的缓存数据。
* detail返回list可以缓存数据了，那么search前往list页面时怎么让list页面不使用缓存数据而是获取新数据呢？
* 我们重新回到list的activated钩子中：
* */
//list页面的activated钩子函数
activated() {
    // isUseCache为false时才重新刷新获取数据
    // 因为对list使用keep-alive来缓存组件，所以默认是会使用缓存数据的
    if(!this.$route.meta.isUseCache){
        this.list = []; // 清空原有数据
        this.onLoad(); // 这是我们获取数据的函数
        this.$route.meta.isUseCache = false;
    }
}
/*
*我们加了this.$route.meta.isUseCache = false;也就是从detail返回list后
* 将list的isUseCache设置为false，而从detail返回list钱，我们设置了list
* 的isUseCache为true
* */