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
                  <el-button size="small" type="success" @click="assignPerm(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>

            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <!-- 将当前页码绑定到分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :page-size="pageSetting.pagesize"
                :total="pageSetting.total"
                :current-page="pageSetting.page"
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

      <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
        <!-- 权限是一颗树 -->
        <!-- 将数据绑定到组件上 -->
        <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
        <!-- id作为唯一标识 -->
        <!-- <el-tree
          :default-checked-keys="selectCheck"
          node-key="id"
        /> -->
        <el-tree
          ref="permTree"

          :data="permList"
          :props="{label: 'name'}"

          :default-expand-all="true"
          :show-checkbox="true"

          :check-strictly="true"

          node-key="id"
        />
        <!-- 确定 取消 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
            <el-button size="small" @click="btnPermCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCompanyInfo, getRoleList, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { mapGetters } from 'vuex'
import { getPermissionList } from '@/api/permission'
import { listToTreeData } from '@/utils'
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
      },
      // 权限弹窗的数据
      showPermDialog: false,
      roleId: '',
      permList: []
      // 被选中的 key (这里已经设定过以 id 作为 key)
      // selectCheck: []

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
        // 1. 设定最新的 total
        // 如果原来 total 是 10 分页组件认为有 5 页
        // ++ 之后分页组件就知道有 6 页了 再去计算和翻页, 就没问题了
        this.pageSetting.total++
        // 2. 计算出最新的页码
        this.pageSetting.page = Math.ceil(this.pageSetting.total / this.pageSetting.pagesize)
      }
      // 提示用户
      this.$message.success('操作成功')
      // 更新页面
      this.getRoleList()
      // 关闭弹窗
      this.showDialog = false
    },
    btnPermOK() {},
    btnPermCancel() {
      this.$refs.permTree.setCheckedKeys([])
      this.showPermDialog = false
    },
    async assignPerm(id) {
      // 弹窗显示的数据两部分组成所有的权限列表+当前角色拥有的权限
      // 全部权限
      this.permList = listToTreeData(await getPermissionList(), '0')
      // 当前角色权限
      const { permIds } = await getRoleDetail(id)
      // this.selectCheck = permIds
      // 不在设定 selectCheck
      // 而是通过饿了么的方法设置那个节点应该被选中

      // setTimeout(() => {
      //   this.$refs.permTree.setCheckedKeys(permIds)
      // }, 200)
      // 接收点击的 id 有两个地方用到
      // 1.获取旧数据
      // 2. 暂存待会编辑的时候发请求要用
      this.roleId = id
      this.showPermDialog = true

      this.$nextTick(() => {
        this.$refs.permTree.setCheckedKeys(permIds)
      })
    }
  }
}
</script>

<style>

</style>
