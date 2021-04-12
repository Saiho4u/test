// 引入库
import axios from 'axios'

// 创建公共请求实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use()

// 响应拦截器
service.interceptors.response.use()

// 暴露实例
export default service
