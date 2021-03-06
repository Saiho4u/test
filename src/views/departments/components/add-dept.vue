<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
          @blur="checkManager"
        >
          <el-option v-for="item in employeeList" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDeptDetailById, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      required: true
    }
  },
  data() {
    const checkRepeatName = async(rule, value, callback) => {
      // 如果相同父部门下有重名, 就报错
      // 1. 所有部门列表
      const { depts } = await getDepartments()
      // 之前是只管新增, 现在有编辑
      // 编辑和新增的区别在于
      // 1. 名字重名需要把自己排除在外
      // 2. 查找同级时, 父部门不再是自己而是上一层 不是 node.id 而是 node.pid
      let isRepeat = false

      if (this.formData.id) {
        // 编辑
        const pid = this.node.pid

        isRepeat = depts
          .filter(item => item.pid === pid && item.id !== this.node.id)
          .some(item => item.name === value)
      } else {
        // 新增
        // 2. 当前选中部门的id
        const pid = this.node.id
        // 3. 通过筛选就能够得出当前的所有同级
        // 4. 同级之间不能 重复即可
        isRepeat = depts
          .filter(item => item.pid === pid)
          .some(item => item.name === value)
      }

      isRepeat ? callback(new Error('同一部门下不能重名')) : callback()
    }
    const checkRepeatCode = async(rule, value, callback) => {
      // 1. 获取全部的部门列表
      const { depts } = await getDepartments()
      let isRepeat = false

      if (this.formData.id) {
        // 编辑
        // 必须将自己排除在外
        isRepeat = depts.some(item => item.code === value && item.id !== this.node.id)
      } else {
        // 新增
      // 2. 只要任意一个 code 相同, 就应该报错
        isRepeat = depts.some(item => item.code === value)
      }

      isRepeat ? callback(new Error('code 必须唯一')) : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '数据不能为空', trigger: 'blur' },
          { max: 50, message: '长度不能超过 50', trigger: 'blur' },
          // 第三规则同部门下不能重名
          { trigger: 'blur', validator: checkRepeatName }
        ],
        code: [
          { required: true, message: '数据不能为空', trigger: 'blur' },
          { max: 50, message: '长度不能超过 50', trigger: 'blur' },
          { trigger: 'blur', validator: checkRepeatCode }
        ],
        manager: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '数据不能为空', trigger: 'blur' },
          { max: 300, message: '长度不能超过 300', trigger: 'blur' }
        ]
      },
      employeeList: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.employeeList = await getEmployeeSimple()
    },
    checkManager() {
      setTimeout(() => {
        this.$refs.addDeptForm.validateField('manager')
      }, 100)
    },
    async btnOK() {
      // 校验
      await this.$refs.addDeptForm.validate()
      // 发请求
      // 需要根据当前状态
      // 决定是编辑还是新增
      if (this.formData.id) {
        // 编辑
        await updateDepartments(this.formData)
      } else {
        // 新增
        await addDepartments({ ...this.formData, pid: this.node.id })
      }
      // 弹出提示
      this.$message.success('操作成功')
      // 通知页面更新数据
      this.$emit('addDepartments')
      // 关闭弹窗
      // this.showDialog = false
      // 不要再当前的子组件修改父组件传入的 prop
      this.$emit('update:showDialog', false)
    },
    btnCancel() {
      // form 表单清理函数只管绑定了的数据
      // 后续回显硬加进去的数据则无法清理
      // 我们可以手动将数据 回复原样
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭前清理表单绑定数据
      // 还有清理校验错误提示
      this.$refs.addDeptForm.resetFields()
      // 关闭弹窗
      this.$emit('update:showDialog', false)
    },
    async getDeptDetailById(id) {
      this.formData = await getDeptDetailById(id)
    }
  }
}
</script>

<style>

</style>
