import router from '@/router'

import store from '@/store'

const whiteList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  // 是否有 token
  if (store.getters.token) {
    // 有 token
    // 是否跳到登录页
    if (to.path === '/login') {
      // 是 去登录页
      next('/')
    } else {
      // 不是
      next()
    }
  } else {
    // 没有 token
    // 目的地是否存在于白名单
    // if (whiteList.indexOf(to.path) > -1) {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
