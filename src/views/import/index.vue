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
      console.log(data.results)
      // 这里得到的数据, 在 data.result 里面
      // 跟 api 的差距在于
      // 1. key 是中文需要翻译
      // 2. 日期时5位数需要转换

      // 翻译的步骤
      // 1. 字典
      const dict = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // 2. 遍历数组单独拿出每个员工进行翻译
      const newUserArray = data.results.map(user => {
        // console.log(user)
        // 这里遍历出来一个个员工
        // 虽然可以在这直接翻译, 剧场逻辑太麻烦容易混淆
        // 建议单独封装一个函数, 作为翻译功能
        // 这个函数可以接受一个中文 key 组成的员工对象
        // 给你返回一个英文 key
        return this.zh2en(user, dict)
      })

      console.log(newUserArray)
    },
    zh2en(user, dict) {
      const newUser = {}
      // 我们接受一个中文key 的 user
      // 最终返回一个英文 key
      // 只需要遍历用户的所有属性
      // 之后一一对应英文 key 放到 newUser 当中
      for (const key in user) {
        // 应该找到对应的英文 key
        const enKey = dict[key]
        // 将对应的 value 值放入新用户对象的 英文 key 中
        newUser[enKey] = user[key]
      }
      return newUser
    }
  }
}
</script>

<style>

</style>
