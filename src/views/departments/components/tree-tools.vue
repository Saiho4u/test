<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <strong v-if="isRoot">{{ data.name }}</strong>
      <span v-else>{{ data.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ data.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown>
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="addDepartments">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot">修改部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" @click.native="delDepartments(data.id)">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async delDepartments(id) {
      console.log('删除部门')
      // 二次确认
      await this.$confirm('是否确认删除该部门')
      // 发请求
      await delDepartments(id)
      // 弹出提示
      this.$message.success('删除成功')
      // 更新页面
      this.$emit('delDepartments')
    },
    addDepartments() {
      this.$emit('addDepartments', this.data)
    }
  }
}
</script>

<style>

</style>
