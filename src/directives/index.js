export const imgerror = {
  // 这里配置一些钩子函数
  // 这里的钩子,是指那些被使用当前指令的 dom 的声明周期
  inserted(dom, options) {
    if (!dom.src) {
      dom.src = options.value
    }
    // 这个钩子会在 dom 被插入父组件的时候触发,
    // 可以接受到两个参数
    // 1. 当前的 dom
    // 2. 当前指令的配置
    console.log(dom)
    console.log(options)
    // 接下来只需要定义他的错误处理, 修改 src 即可
    dom.onerror = function() {
      // dom.src = 备用的图片地址
      dom.src = options.value
    }
  },
  // 上一个 inserted 钩子是在dom插入页面是触发
  // 但是如同 表格翻页, 或者排序重新加载等情况
  // 有另外一个钩子 componentUpdated
  componentUpdated(dom, options) {
    if (!dom.src) {
      dom.src = options.value
    }
  }
}
