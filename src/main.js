import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 添加自定义指令
// Vue.directive(指令名, 指令的配置对象)
import { imgerror } from '@/directives'
Vue.directive('imgerror', imgerror)

// // 全局注册组件
// // Vue.component(组件名, 组件对象)
// import PageTools from '@/components/PageTools'
// Vue.component('PageTools', PageTools)
// import '@/components/index.js'
// 以上这种办法并不规范, 既不符合导入导出对象的习惯
// 也没有明确所操作的事情
// vue 提供了一个插件安装机制
// Vue.use(插件对象)

// // 模拟伪代码
// Vue.use = (obj) => {
//   // 每当 use 接收到一个对象时
//   // 自动执行对象里面的 install 方法
//   // 同时将 vue 的构造器传入
//   obj.install(Vue)
// }
import Component from '@/components/index.js'
Vue.use(Component)

// 过滤器创建
// Vue.filter(名字, 过滤函数)
// import { formatDate } from '@/filters'
// Vue.filter('formatDate', formatDate)
// 上面这种呢是逐个函数引入注册过滤器
// 希望可以统一将所有过滤器一起引入并注册
// 1. 将来自于一个文件的所有暴露属性一起引入放到一个对象中
import * as filters from '@/filters'
// console.log(filters)
// 遍历 filters 里面的所有属性, 以 key 为名称 以 value 为函数
// for in 循环可以遍历对象
for (const key in filters) {
  // console.log(key)
  // 对应的函数可以回到 filters 里面拿
  // filters[key]
  Vue.filter(key, filters[key])
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

