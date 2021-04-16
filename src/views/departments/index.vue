<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 实现了头部内容 -->
        <TreeTools :data="company" :is-root="true" @addDepartments="addDepartments" />
        <hr>
        <!-- 这里是树形组件显示的地方 -->
        <el-tree :data="departs" :props="treeOption" :default-expand-all="true">
          <!-- 在这个属性组件的插槽里面可以控制每一个节点显示时的样式 -->
          <!-- 每个插槽都有两个参数, 第一插槽名, 第二作用域插槽形参 -->
          <template slot-scope="scope">
            <!-- 每次渲染到的部门数据, 就会在 scope.data 里面储存 -->
            <!-- {{ scope.data.name }} -->
            <TreeTools
              :data="scope.data"
              @delDepartments="getDepartments"
              @addDepartments="addDepartments"
              @editDepartments="editDepartments"
            />
          </template>
        </el-tree>
      </el-card>

      <AddDept ref="addDept" :show-dialog.sync="showDialog" :node="node" @addDepartments="getDepartments" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'
import { getDepartments } from '@/api/departments'
import { listToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {
        name: '江苏传智播客教育科技股份有限公司',
        manager: '负责人',
        id: ''
      },
      departs: [],
      treeOption: {
        label: 'name'
      },
      showDialog: false,
      node: {}
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const { depts } = await getDepartments()
      // res.depts 就是我们想要的部门数组
      this.departs = listToTreeData(depts, '')
    },
    addDepartments(data) {
      this.showDialog = true
      this.node = data
    },
    async editDepartments(data) {
      // 这里是编辑的弹窗
      // 除了之前新增要做的事情
      // 包括弹窗, 和记录当前被点击的部门以外
      // 还需要通知弹窗, 记得回显数据
      // 这里知道是编辑, 但是这里没法修改子组件数据
      // 修改函数需要卸载子组件里面
      // 这里只负责触发
      await this.$refs.addDept.getDeptDetailById(data.id)
      this.showDialog = true
      this.node = data
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
