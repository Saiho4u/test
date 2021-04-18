<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 3. 渲染 -->
      <PageTools :show-before="true">
        <template slot="before">
          123
        </template>
        <template slot="after">
          456
        </template>
      </PageTools>
    </div>
  </div>
</template>

<script>
// 1. 引入
// import PageTools from '@/components/PageTools'
export default {
// 2. 注册
  // components: {
  //   PageTools
  // }
}
</script>

<style>

</style>
