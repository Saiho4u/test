<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 实现了头部内容 -->
        <TreeTools :data="company" :is-root="true" />
        <hr>
        <!-- 这里是树形组件显示的地方 -->
        <el-tree :data="departs" :props="treeOption" :default-expand-all="true">
          <!-- 在这个属性组件的插槽里面可以控制每一个节点显示时的样式 -->
          <!-- 每个插槽都有两个参数, 第一插槽名, 第二作用域插槽形参 -->
          <template slot-scope="scope">
            <!-- 每次渲染到的部门数据, 就会在 scope.data 里面储存 -->
            <!-- {{ scope.data.name }} -->
            <TreeTools :data="scope.data" />
          </template>
        </el-tree>
      </el-card>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
export default {
  components: {
    TreeTools
  },
  data() {
    return {
      company: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人'
      },
      departs: [
        {
          name: '总裁办',
          manager: '老王',
          children: [
            { name: '董事会', manager: '小王' }
          ]
        },
        {
          name: '行政部',
          manager: '大王'
        },
        {
          name: '人事部',
          manager: '炸弹'
        }
      ],
      treeOption: {
        label: 'name'
      }
    }
  }
}
</script>

<style scoped>
  .tree-card {
    padding: 30px 140px;
    font-size: 14px;
  }
</style>
