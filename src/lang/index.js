import Vue from 'vue'
// 1. 安装引入
import VueI18n from 'vue-i18n'
// 2. Vue.use 注册
Vue.use(VueI18n)
// 3. 创建实例
export default new VueI18n({
  // 当前语言设定
  locale: 'zh',
  // 字典
  messages: {
    zh: {
      hi: '你好',
      goodday: '祝你开心每一天'

    },
    en: {
      hi: 'Hello',
      goodday: 'Have a good day'
    }
  }
})
