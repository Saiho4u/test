<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 树形组件的演示 -->
      <el-tree :data="list" :default-expand-all="true" :props="options" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        // 树形数据的第一个重点
        // 当前节点的名称, 使用 lable 来声明
        {
          name: '一级1'
        },
        {
          name: '一级2',
          // 树形数据的第二个重点
          // 如果有下级数据, 应该以 children 声明下级数组
          son: [
            { name: '二级1' },
            {
              name: '二级2',
              son: [
                {
                  name: '三级1'
                }
              ]
            }
          ]
        },
        {
          name: '一级3'
        }
      ],
      options: {
        // 可以定义一个对象
        // 给 el-tree 作为 props 树形
        // 默认情况下, 节点名叫 label, 子元素字段叫 children
        // 也可以自己制定
        label: 'name',
        children: 'son'
      }
    }
  }
}
</script>

<style>
</style>
