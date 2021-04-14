import router from '@/router'

import store from '@/store'

const whiteList = ['/login', '/404']

router.beforeEach(async(to, from, next) => {
  // 是否有 token
  if (store.getters.token) {
    // 有 token
    // 是否跳到登录页
    if (to.path === '/login') {
      // 是 去登录页
      next('/')
    } else {
      // 不是
      // 如果是有 token 又不是去登录页
      // 那么就是进入正常的后台管理页面
      // 无论是哪个页面, 其实都需要用户信息
      // 就可以在这发起请求获取用户数据
      console.log('这里是导航守卫获取用户资料,之后再进入页面')
      // 这里还可以做判断, 如果是第一次进入,或者刷新页面
      // 没有数据的情况下,再发请求, 如果是页面之间的跳转
      // 之前已经有数据就不必再次发送了
      if (!store.state.user.userInfo.userId) {
        await store.dispatch('user/getUserInfo')
      }

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
