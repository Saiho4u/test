// 引入库
import axios from 'axios'

// 引入饿了么弹窗插件
import { Message } from 'element-ui'

import store from '@/store'

// 创建公共请求实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求当中添加 token (如果有)
    // token 的固定格式
    // 当前我们用的校验标准叫做 jwt bearer token
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + store.getters.token
    }
    // 必须放行
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
// 响应拦截器当中, 可以接受两个参数, 两个都是函数
// 第一个函数用来处理网络层面的成功
// 第二个函数用来处理网络层面的失败
service.interceptors.response.use(
  res => {
    // 这里是网络请求成功的部分
    // 这里不一定都是对的
    // 即使网络请求成功, 也有可能是数据层面的失败
    // 解构服务器给我们传回的三个数据 message success data
    console.log(res)
    const { message, success, data } = res.data
    if (success) {
      // 成功
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  err => {
    // 这是网络层面的失败
    console.log('这是网络层面的失败')
    // 这里应该弹出错误提示
    Message.error(err.message)
    // 拒绝掉当前的请求 promise
    // 如果在一个 promise 的中间,
    // 想要当前 promise 马上报错
    // 需要返回一个 Promise.reject()
    return Promise.reject(new Error(err.message))
    // console.log(err)
  }
)

// 暴露实例
export default service
