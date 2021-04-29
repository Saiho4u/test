// 这里咱们想要拆分全局组件注册的逻辑
// 全局注册组件
// Vue.component(组件名, 组件对象)
// import Vue from 'vue'
// import PageTools from '@/components/PageTools'
// Vue.component('PageTools', PageTools)

// 我想要创建一个符合 vue 插件机制的插件
// 暴露一个对象
// 对象里面必须有 install 属性, 是一个函数, 调用时会接受 Vue 构造器
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
import ScreenFull from '@/components/ScreenFull'
import ThemePicker from '@/components/ThemePicker'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
  }
}
