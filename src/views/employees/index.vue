<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 这里是头部公共工具栏 -->
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="export2Excel">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 页面主要内容 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" width="200">
            <template slot-scope="scope">
              <img v-imgerror="require('@/assets/common/head.jpg')" :src="scope.row.staffPhoto" alt="" class="avatar" @click="showCode(scope.row.staffPhoto)">
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="scope">
              {{ scope.row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="scope">
              <!-- {{ scope.row.enableState }} -->
              <el-switch :value="scope.row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push('/employees/detail/' + row.id)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="pageSetting.total"
            :page-size="pageSetting.size"
            @current-change="currentChange"
          />
        </el-row>
      </el-card>

      <AddEmployee :show-dialog.sync="showDialog" />

      <AssignRole :show-role-dialog="showRoleDialog" :user-id="userId" />

      <el-dialog title="头像二维码" :visible="isShowCode" @close="isShowCode = false">
        <!-- <el-row type="flex" justify="center"> -->
        <div class="canvasWrapper">
          <canvas ref="myCanvas" />
          <img :src="avatarUrl" alt="" class="codeCover">
        </div>
        <!-- </el-row> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
// 1. 引入
// import PageTools from '@/components/PageTools'
import { delEmployee, getEmployeeList } from '@/api/employees'
import employeesEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
// 总是引入 excel 导出包有点浪费, 因为只有点击时才使用, 比较少
// import * as excel from '@/vendor/Export2Excel'

import AddEmployee from './components/add-employee'
import AssignRole from './components/assign-role'

import QRCode from 'qrcode'

export default {
// 2. 注册
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      list: [],
      pageSetting: {
        total: 0,
        page: 1,
        size: 2
      },
      showDialog: false,
      isShowCode: false,
      avatarUrl: '',
      // 处理角色分配功能
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    // 发请求
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.pageSetting)
      this.pageSetting.total = total
      this.list = rows
      this.loading = false
    },
    currentChange(newPage) {
      this.pageSetting.page = newPage
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue) {
      // 这里可以接受到当前格子的数据
      // 一共四个参数
      // 在这里可灵活的进行格式化,
      // 最终 return 的值会显示在页面上
      // 从枚举数据中找到 id 跟我的格子数据一样的对象, 输出他的 value 即可
      const obj = employeesEnum.hireType.find(item => item.id === cellValue)
      // 我们的枚举都是有限, 所以有可能找不到
      return obj ? obj.value : '未知形式'
    },
    async export2Excel() {
      // 1. 引入库
      const excel = await import('@/vendor/Export2Excel')
      // 2. 加载数据
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.pageSetting.total
      })
      // 3. 按需转换
      const dict = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(dict)
      const data = rows.map(user => {
        return this.obj2Array(user, dict)
      })
      // 4. 保存文件
      excel.export_json_to_excel({
        header,
        data
      })

      // // 先要拿到所有的员工数据
      // const { rows } = await getEmployeeList({
      //   page: 1,
      //   size: this.pageSetting.total
      // })

      // console.log(rows)
      // // 每当点击按钮就要导出
      // // 需要用到 vendor/Export2Excel.js 文件
      // // 如果是最上方引入的话, 这里直接就可以 log 了
      // // 如果没有在上方引入, 可以在这个点击的时候
      // // 就按需加载
      // // import('@/vendor/Export2Excel').then(excel => {
      // //   console.log(excel)
      // // })
      // const excel = await import('@/vendor/Export2Excel')
      // console.log(excel)
      // // 调用 excel.export_json_to_excel 需要带上配置对象
      // excel.export_json_to_excel({
      //   // 两个必填参数
      //   header: ['姓名', '年龄', '性别'],
      //   data: [
      //     // { 姓名: 'tom', 年龄: 666, 性别: 男 }
      //     ['tom', 666, '男'],
      //     ['rose', 666, '女']
      //   ]
      // })
    },
    obj2Array(user, dict) {
      const newUser = []
      // 1. 遍历表头
      for (const key in dict) {
        // 2. 拿到表头对应的英文 key
        const enKey = dict[key]
        // 3. 得到 user 当中的数据
        // 需要根据 key 做额外特殊处理
        let value
        if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
          // 处理时间 value | format
          value = formatDate(user[enKey])
        } else if (enKey === 'formOfEmployment') {
          // 处理聘用形式
          const obj = employeesEnum.hireType.find(item => item.id === user[enKey])
          value = obj ? obj.value : '未知形式'
        } else {
          value = user[enKey]
        }

        // 4. 放入新数组中
        newUser.push(value)
      }
      return newUser
    },
    async delEmployee(id) {
      // 二次校验
      await this.$confirm('是否确认删除?')
      // 请求
      await delEmployee(id)
      // 提示
      this.$message.success('删除成功')
      // 更新页面
      this.getEmployeeList()
    },
    showCode(url) {
      if (url) {
        this.isShowCode = true
        this.avatarUrl = url
        // 在这里应该生成一个二维码
        // 利用当前头像的 url
        // 要等到渲染完, 弹窗出现后再生成二维码
        // 1. 延时器 猜一个 100 毫秒
        // setTimeout(() => {
        //   QRCode.toCanvas(this.$refs.myCanvas, url)
        // }, 100)
        // 2. vue 提供的下次渲染完毕再执行回调的函数
        this.$nextTick(() => {
          QRCode.toCanvas(this.$refs.myCanvas, url, {
            width: 300,
            color: {
              dark: '#66b1ff'
            }
          })
        })
      }
    },
    assignRole(id) {
      this.showRoleDialog = true
      this.userId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.canvasWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.codeCover {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    // 限定宽和高的情况下保持图片的比例
    // object-fit: contain;
    object-fit: cover;
}
</style>
