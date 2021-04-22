<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">

            <!-- 放置表单 -->
            <el-form ref="formData" :model="formData" :rules="rules" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="formData.username" style="width:300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input v-model="formData.password2" style="width:300px" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="btnOK">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      formData: {
        username: '',
        // password: ''
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '改数据不能为空', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1-5 之间', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '改数据不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6-16 之间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    async btnOK() {
      await this.$refs.formData.validate()
      await saveUserDetailById({ ...this.formData, password: this.formData.password2 })
      this.$message.success('操作成功')
    }
  }
}
</script>

<style>

</style>
