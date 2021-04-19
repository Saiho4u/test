<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="roleList">

              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" prop="name" width="240" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :page-size="pageSetting.pagesize"
                :total="pageSetting.total"
                @current-change="currentChange"
              />
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>

        </el-tabs>
      </el-card>

      <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
        <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      // 公司信息
      formData: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      // 决定分页数据
      pageSetting: {
        page: 1,
        pagesize: 2,
        total: 0
      },
      roleList: [],
      showDialog: false,
      // 员工弹窗数据
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '数据不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    title() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getCompanyInfo()
    this.getRoleList()
  },
  methods: {
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.pageSetting)
      this.roleList = rows
      this.pageSetting.total = total
    },
    currentChange(newPage) {
      // 1. 设定当前页
      this.pageSetting.page = newPage
      // 2. 发请求
      this.getRoleList()
    },
    async deleteRole(id) {
      // 二次校验
      await this.$confirm('是否确认删除')
      // 发请求
      await deleteRole(id)
      // 担心当前页面删没了怎么办
      // 1. 如果当前页面只剩下一条 应该向前翻页
      // 2. 如果当前已经在第一页则是例外, 不翻页
      // 提示
      if (this.roleList.length === 1 && this.pageSetting.page !== 1) {
        this.pageSetting.page--
      }
      this.$message.success('删除成功')
      // 重新加载
      this.getRoleList()
    },
    async editRole(id) {
      // 编辑在打开弹窗前请记得回显数据
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    btnCancel() {
      // 因为编辑可能回显一些没有绑定过的数据
      // 要手动清除
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清理表单自带的清理函数
      // 可以清理表单绑定的数据
      // 和错误提示
      this.$refs.roleForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    },
    async btnOK() {
      // 校验表单
      await this.$refs.roleForm.validate()
      // 发请求
      // 可以预想之后的添加新角色也是这个函数
      // 根据当前表单是否有回显 id 可以决定是什么 api
      if (this.roleForm.id) {
        // 编辑
        await updateRole(this.roleForm)
      } else {
        // 新增
        await addRole(this.roleForm)
      }
      // 提示用户
      this.$message.success('操作成功')
      // 更新页面
      this.getRoleList()
      // 关闭弹窗
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
