/**
 * api接口统一管理
 * */
import {get, post }　from './http'

//http://www.baiodu.com/api/v1/users/my_address/address_edit_before

//定义一个方法，参数p，是请求时携带的对象
export const apiAddress = p => post('api/v1/users/my_address/address_edit_before',p)

//调用事例
import {apiAddress} from './api'
 methods:{
 onLoad(){
  apiAddress({
      type:0,
      sort:1
  }).then(res => {
        //获取数据后的其他操作
  })
     }
 }
