// 引入库
import axios from 'axios'

// 引入饿了么弹窗插件
import { Message } from 'element-ui'

import store from '@/store'

import router from '@/router'

import { getTimeStamp } from '@/utils/auth'

const timeoutDuration = 500000

function checkTimeout() {
  // 1. 拿出之前记录的时间
  const oldTime = getTimeStamp()
  // 2. 拿出现在的时间 相减 = 经过的时候
  const currentTime = Date.now()
  // 3. 定义一个超时范围, 如果超过则是失效
  return currentTime - oldTime >= timeoutDuration
}

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
      // 发现有 token 在注入之前
      // 应该先校验时间是否超时
      if (checkTimeout()) {
        // 已经超时的操作
        // 1. 提示错误(还是会走响应拦截, 所以已经弹过窗了)
        // Message.error('token 已超时')
        // 2. 执行退出 action 清理数据
        store.dispatch('user/logout')
        // 3. 跳转页面
        router.push('/login')
        // 4. 停止当前的请求
        return Promise.reject(new Error('token 已超时'))
      } else {
        config.headers.Authorization = 'Bearer ' + store.getters.token
      }
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
