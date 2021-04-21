<template>
  <el-dialog title="新增员工" :visible="showDialog">
    <!-- 表单 -->
    <el-form ref="addEmployee" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 90%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 90%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 90%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 90%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in employeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 90%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 90%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTree"
          class="deptsList"
          :data="depts"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          @node-click="selectDepartment"
        />
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 90%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
// 引入部门数据所需函数
// 1. api
import { getDepartments } from '@/api/departments'
// 2. 转换函数
import { listToTreeData } from '@/utils'

import employeeEnum from '@/api/constant/employees'

import { addEmployee } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      depts: [],
      showTree: false,
      employeeEnum
    }
  },
  methods: {
    async getDepartments() {
      const { depts } = await getDepartments()
      this.depts = listToTreeData(depts, '')
      this.showTree = true
    },
    selectDepartment(data) {
      console.log(data)
      // 将选中的节点数据名字赋值给输入框
      this.formData.departmentName = data.name
      // 隐藏弹窗
      this.showTree = false
    },
    async btnOK() {
      // 校验表单
      await this.$refs.addEmployee.validate()
      // 发请求
      await addEmployee(this.formData)
      // 重新渲染
      // 关闭弹窗
      // 我们是子组件,
      // 负责渲染和关闭弹窗的都是父组件
      // 正常情况下需要 $emit 通知父组件处理
      // 另外 this.$parent 可以拿到父组件的属性和方法,直接调用
      this.$parent.getEmployeeList()
      this.$parent.showDialog = false
      this.$message.success('操作成功')
    },
    btnCancel() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .deptsList {
    position: absolute;
    z-index: 9;
    width: 90%;
    border: 1px solid #ccc;
    height: 200px;
    overflow-y: scroll;
  }
</style>
