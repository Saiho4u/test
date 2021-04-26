import store from '@/store'
// 导出一个符合 vue 组件配置的对象
export default {
  methods: {
    checkPerm(name) {
      // 检查这个按钮 name 是否存在于权限 points 数组中
      const points = store.state.user.userInfo.roles.points
      return points.includes(name)
    }
  }
}
