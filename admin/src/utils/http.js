/**
 * axios封装
 * 请求拦截 响应拦截 错误处理
 * */

import axios from 'axios'
import QS from 'qs'
import { Message } from 'element-ui'
import store from '@/store/index'

// 环境切换  （也可在webpack做）
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV === 'debug') {
  axios.defaults.baseURL = ''
}

// 请求超时时间
axios.defaults.timeout = 10000

// post请求头 (不需要，会自动添加)
// axios.defaults.headers.post['Content-Type'] = ''

// 请求拦截
axios.interceptors.request.use(
  config => {
    const token = store.state.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === undefined) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },

  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 401:
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullpath
            }
          })
          break
        case 403:
          Message({
            message: '登录过期，请重新登录',
            duration: 1000
          })
          localStorage.removeItem('token')
          store.commit('localSuccess', null)
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            })
          }, 1000)
          break
        case 404:
          Message({
            message: '网络请求不存在',
            duration: 1500
          })
          break
        default:
          Message({
            message: error.response.data.message,
            duration: 1500
          })
      }
      return Promise.reject(error.response)
    }
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求地址]
 * @param {Object} params [请求是携带的参数]
 * */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

/**
 * post方法
 * 需要对提交对象从参数对象序列化的操作p
 * @param {String} url []
 * @param {Object} params [参数]
 * */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
