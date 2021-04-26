const state = {}

import { asyncRoutes } from '@/router'
const mutations = {}

const actions = {
  filterRoutes(store, menus) {
    // 1. 所有的路由配置
    // 所有的动态路由配置可以进行引入叫 asyncRoutes
    // 2. 当前用户的权限列表
    // 当前的用户页面权限就是传进来的 menus
    // 筛选, 如果路由的名字存在于权限列表就应该保留
    const routes = asyncRoutes.filter(route => menus.includes(route.name))
    console.log('这里是筛选结果')
    console.log(routes)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
