// 这里咱们想要拆分全局组件注册的逻辑
// 全局注册组件
// Vue.component(组件名, 组件对象)
import Vue from 'vue'
import PageTools from '@/components/PageTools'
Vue.component('PageTools', PageTools)
