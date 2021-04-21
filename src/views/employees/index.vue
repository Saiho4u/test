<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 这里是头部公共工具栏 -->
      <page-tools :show-before="true">
        <span slot="before">共166条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="export2Excel">导出</el-button>
          <el-button size="small" type="primary">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 页面主要内容 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
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
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
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
    </div>
  </div>
</template>

<script>
// 1. 引入
// import PageTools from '@/components/PageTools'
import { getEmployeeList } from '@/api/employees'
import employeesEnum from '@/api/constant/employees'
import { formatDate } from '@/filters'
// 总是引入 excel 导出包有点浪费, 因为只有点击时才使用, 比较少
// import * as excel from '@/vendor/Export2Excel'
export default {
// 2. 注册
  // components: {
  //   PageTools
  // }
  data() {
    return {
      loading: false,
      list: [],
      pageSetting: {
        total: 0,
        page: 1,
        size: 2
      }
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
    }
  }
}
</script>

<style>

</style>
