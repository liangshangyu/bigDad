/**
 * Created by 17073565 on 2018/5/9.
 */
import Vue from  'vue'
import App from './app.vue'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
    render: (h) => h(App)
}).$mount(root)