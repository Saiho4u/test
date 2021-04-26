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
        const res = await store.dispatch('user/getUserInfo')
        // 这里是获取数据的地方, 只有获取完数据, 又还没有 next
        // 这个事件点应该过滤路由
        console.log('这里是导航守卫')
        console.log('拿完用户数据, 顺便 return , 这里可以接受接着使用')
        console.log(res)
        // 现在将动态路由从路由配置中删除掉了
        // 这里筛选完有权限的页面配置, 应该重新加到 路由配置中
        const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)

        router.addRoutes(routes)
        next(to.path)
      } else {
        next()
      }
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
