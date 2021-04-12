import { login } from '@/api/user'
const state = {
  token: null
}
const mutations = {
  // 设置 token
  setToken(state, data) {
    state.token = data
  },
  // 清除 token
  removeToken(state) {
    state.token = null
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
    console.log(res.data.data)
    store.commit('setToken', res.data.data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

