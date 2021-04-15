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
import { getDepartments } from '@/api/departments'
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
      departs: [],
      treeOption: {
        label: 'name'
      }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { depts } = await getDepartments()
      // res.depts 就是我们想要的部门数组
      this.departs = this.listToTreeData(depts, '')
    },
    listToTreeData(list, pid) {
      const res = []
      list.forEach(item => {
        if (item.pid === pid) {
          // 递归开始
          const children = this.listToTreeData(list, item.id)
          if (children.length > 0) {
            item.children = children
          }
          // 递归结束
          res.push(item)
        }
      })
      return res
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
