<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPerm(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="permissionList" row-key="id" :default-expand-all="true">
        <el-table-column label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.type === 1" type="text" @click="addPerm(2, scope.row.id)">添加</el-button>
            <el-button type="text" @click="editPerm(scope.row.id)">编辑</el-button>
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
        <!-- 表单 -->
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPermissionList, addPermission, getPermissionDetail, updatePermission } from '@/api/permission'
// 引入树形转换工具
import { listToTreeData } from '@/utils'
export default {
  data() {
    return {
      permissionList: [],

      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: '1'
      },
      rules: {
        name: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '该项不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const res = await getPermissionList()
      console.log('源数据')
      console.log(res)
      this.permissionList = listToTreeData(res, '0')
      console.log('列表转换后')
      console.log(this.permissionList)
    },
    async btnOK() {
      // 校验
      await this.$refs.perForm.validate()
      // 发请求
      // 如果是编辑, 跟新增的接口不一样
      if (this.formData.id) {
        // 编辑
        await updatePermission(this.formData)
      } else {
        // 新增
        await addPermission(this.formData)
      }
      // 更新页面
      this.getPermissionList()
      // 提示
      this.$message.success('操作成功')
      // 关闭弹窗
      this.showDialog = false
    },
    btnCancel() {
      // 清理表单
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: '1'
      }
      // 清理校验
      this.$refs.perForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    },
    addPerm(type, pid) {
      // 由于表单只能填写四个参数
      // 另外两个 pid 和 type 都是点击时决定的
      // 所以需要在弹窗时进行处理
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async editPerm(id) {
      this.formData = await getPermissionDetail(id)
      // 弹窗
      this.showDialog = true
    }
  }
}
</script>

<style>

</style>
