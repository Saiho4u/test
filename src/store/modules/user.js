import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  // 设置 token
  setToken(state, data) {
    state.token = data
    setToken(data)
  },
  // 清除 token
  removeToken(state) {
    state.token = null
  },
  setUserInfo(state, data) {
    state.userInfo = { ...data }
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(store, data) {
    // 本来请求应该在页面当中调用
    // 如果想要封装成公用方法
    // 就可以放在 actions
    // 页面再调用这个 action 即可
    const res = await login(data)
    console.log('这里是 action 发出的请求')
    console.log(res)
    store.commit('setToken', res)
  },
  async getUserInfo(store) {
    // 1. 发请求
    const res = await getUserInfo()
    // 这些数据不够完善, 所以用这个结果的 userId
    // 继续发请求获取更加详细的用户资料
    const detail = await getUserDetailById(res.userId)

    const data = {
      ...res,
      ...detail
    }
    // console.log(res)
    // 2. 调用 Mutations 存在 state 里面
    store.commit('setUserInfo', data)

    // return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

