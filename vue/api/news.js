import base from './base'
import axios from '../httpOptimization'
import qs from 'qs'
const news = {
    newsList() {
        return axios.get(`${base.sq}/topics`)
    },
    newsDetail (id, params) {
        return axios.get(`${base.sq}/topics/${id}`, {
            params: params
        })
    },
    login (params) {
        return axios.post(``,qs.stringify(params))
    }
}
export default news