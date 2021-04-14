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
  // 下面是一种将所有情况拆开的写法, 可以参考
  // const token = store.getters.token
  // const url = to.path
  // // 1. 有 token 去登录页 => 转到首页
  // if (token && url === '/login') {
  //   next('/')
  // }
  // // 2. 有 token 不是去登录页 => 放行
  // if (token && url !== '/login') {
  //   next()
  // }
  // // 3. 没有 token 在白名单 => 放行
  // if (!token && whiteList.includes(url)) {
  //   next()
  // }
  // // 4. 没有 token 不在白名单 => 转到登录页
  // if (!token && !whiteList.includes(url)) {
  //   next('/login')
  // }
})
