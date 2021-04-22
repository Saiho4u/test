<template>
  <div>
    <!-- 动态组件的使用方法
    动态组件可以用来显示任意可用组件 -->
    <!-- 只需要绑定一个 :is 属性, 指定对应的组件名即可 -->
    <button @click="componentName = 'UserInfo'">个人信息</button>
    <button @click="componentName = 'JobInfo'">岗位信息</button>
    <br>
    <component :is="componentName" />
    <!-- <UserInfo v-if="componentName === 'UserInfo'" />
    <JobInfo v-if="componentName === 'JobInfo'" /> -->
  </div>
</template>

<script>
import UserInfo from '@/views/employees/components/user-info'
import JobInfo from '@/views/employees/components/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      componentName: 'JobInfo'
    }
  }
}
</script>

<style>

</style>
