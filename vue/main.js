//为方便api调用 挂载到vue原型上
import api from './api'
Vue.prototype.$api = api


//调用实例
/*
methods:{
    onLoad(id) {
        this.$api.news.newsDetail(id , {
            api: 123
        }).then(res => {

        })
    }
}*/
