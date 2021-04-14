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
Vue.directive('imgerror', {
  // 这里配置一些钩子函数
  // 这里的钩子,是指那些被使用当前指令的 dom 的声明周期
  inserted(dom, options) {
    // 这个钩子会在 dom 被插入父组件的时候触发,
    // 可以接受到两个参数
    // 1. 当前的 dom
    // 2. 当前指令的配置
    console.log(dom)
    // 接下来只需要定义他的错误处理, 修改 src 即可
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
