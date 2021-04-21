<template>
  <UploadExcel :on-success="upload" />
</template>

<script>
import { importEmployees } from '@/api/employees'
export default {
  methods: {
    async upload(data) {
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

      await importEmployees(newUserArray)

      this.$message.success('上传成功')

      this.$router.back()
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
        // 普通情况下, 直接将源数据放入新用户对象是可以的
        // 除了日期的特殊情况, 需要先进性转换
        if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
          // 转换日期
          const timeStr = this.formatDate(user[key], '/')
          const date = new Date(timeStr)
          newUser[enKey] = date
        } else {
          newUser[enKey] = user[key]
        }
      }
      return newUser
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }
  // 以下是详细讲解
  // methods: {
  //   async upload(data) {
  //     // 来源数据在 data 中
  //     // data.results = [
  //     //   { 姓名: '高大山', 电话: '13222222222', 工号: '29283' },
  //     //   { 姓名: '高大山', 电话: '13222222222', 工号: '29283' },
  //     //   { 姓名: '高大山', 电话: '13222222222', 工号: '29283' }
  //     // ]

  //     const dict = {
  //       姓名: 'username',
  //       电话: 'mobile',
  //       工号: 'workNumber'
  //     }

  //     const newData = data.results.map(item => {
  //       return this.zh2en(item, dict)
  //     })

  //     // 最终需要做的事情就是发请求
  //     // newData = [
  //     //   { username: '高大山', mobile: '13222222222', workNumber: '29283' },
  //     //   { username: '高大山', mobile: '13222222222', workNumber: '29283' },
  //     //   { username: '高大山', mobile: '13222222222', workNumber: '29283' }
  //     // ]

  //     // uploadExcelApi(newData)
  //   },
  //   zh2en(user, dict) {
  //     // user = { 姓名: '高大山', 电话: '13222222222', 工号: '29283' }
  //     // newUser = { username: '高大山', mobile: '13222222222', workNumber: '29283' }
  //     // dict = {
  //     //   姓名: 'username',
  //     //   电话: 'mobile',
  //     //   工号: 'workNumber'
  //     // }
  //     const newUser = {}
  //     for (const key in user) {
  //       const enKey = dict[key] // username
  //       const value = user[key] // 高大山
  //       newUser[enKey] = value
  //     }
  //     return newUser
  //   }
  // }
}
</script>

<style>

</style>
