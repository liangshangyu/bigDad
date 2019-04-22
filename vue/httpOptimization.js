import axios from 'axios'
import router from './router'
import store from './store/index.js'
import {} from ''  //UI组件库提示框

const tip = msd => {
    Toast({
        message: msg,
        duration: 1000,
        forbidClick: true
    });
}

const toLogin = () => {
    router.replace({
        path: '/login',
        query: {
            redirect: router.currentRoute.fulPath
        }
    })
}

const errorHandle =  (status, other) => {
    switch (status) {
        case 401:
            toLogin();
            break
        case 403:
            tip('登录过期，请重新登录');
            localStorage.removeItem('token')
            store.commit('loginSuccess', null)
            setTimeout(() => {
                toLogin()
            },1000);
            break;
        case 404:
            tip('请求的资源不存在')
            break;
        default:

    }
}

var instance = axios.create({timeout: 10000})

instance.default.headers.post['Content-Type'] = ''

instance.interceptors.request.use(
    config => {
        const token = store.state.token
        token && (config.hraders.Authorization = token)
    },
    error => Promise.error(error)
)

instance.interceptors.response.use(
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject((res)),
    error => {
        const {response} = error
        if (response) {
            errorHandle(response.status, response.data.message)
            return Promise.reject(response)
        }else {
            store.commit('changeNetwork', false)
        }
    }
)
export default instance;