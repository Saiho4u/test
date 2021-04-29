import Vue from 'vue'
// 1. 安装引入
import VueI18n from 'vue-i18n'
// 2. Vue.use 注册
Vue.use(VueI18n)

// 引入饿了么的翻译字典
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import elementEN from 'element-ui/lib/locale/lang/en'

// 引入菜单翻译包
import customZH from './zh'
import customEN from './en'

// 3. 创建实例
export default new VueI18n({
  // 当前语言设定
  locale: 'en',
  // 字典
  messages: {
    zh: {
      hi: '你好',
      goodday: '祝你开心每一天',
      ...elementZH,
      ...customZH
    },
    en: {
      hi: 'Hello',
      goodday: 'Have a good day',
      ...elementEN,
      ...customEN
    }
  }
})
