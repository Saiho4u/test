<template>
  <UploadExcel :on-success="upload" />
</template>

<script>
export default {
  methods: {
    upload(data) {
      // 这里是交给子组件的成功回调
      // 可以接收到子组件给的数据
      // 可以打出来看看
      console.log(data)
      // 这里得到的数据, 在 data.result 里面
      // 跟 api 的差距在于
      // 1. key 是中文需要翻译
      // 2. 日期时5位数需要转换
    }
  }
}
</script>

<style>

</style>
