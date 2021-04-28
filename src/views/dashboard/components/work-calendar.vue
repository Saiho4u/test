<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="small" style="width: 120px" @change="dateChange">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px" @change="dateChange">
        <el-option v-for="item in 12" :key="item" :label="item" :value="item">{{ item }}</el-option>
      </el-select>
    </el-row>
    <el-calendar v-model="currentDate">
      <!-- <template slot="dateCell" slot-scope="scope">
        <div>{{ scope.data.day.split('-')[2] }}</div>
      </template> -->
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeekend(date)" class="rest">休</span>
          <!-- <span v-if="isWeek(date)" class="rest">休</span> -->
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {
    getDay(oldVal) {
      const dayStr = oldVal.split('-')[2]
      return dayStr.startsWith('0') ? dayStr.substr(1) : dayStr
    }
  },
  data() {
    return {
      currentDate: new Date(),
      currentMonth: '',
      currentYear: '',
      yearList: []
    }
  },
  created() {
    // 每当使用这个组件的时候就要自动生成 年份列表
    // 中间是当前年份
    // 我们的设计时往前往后各推 5年
    // Array(11) 可以生成只带有长度属性的一个数组
    // 要利用这个数组生成年份表
    // Array.from(有长度的数据来源, 生成的回调函数)
    this.currentYear = this.currentDate.getFullYear()
    this.currentMonth = this.currentDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (val, index) => this.currentYear + index - 5)
  },
  methods: {
    dateChange() {
      // 这个地方是下拉菜单触发的函数
      // 每当切换年或者月的时候
      // 重新获取日期渲染到日历上 currentDate
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`)
    },
    isWeekend(date) {
      // 获取一个日期星期几的方法 getDay
      // 这里只判断星期六星期天
      // 如果需要其他节假日
      // 需要后端的配合传来一个节假日的数组
      // 我们就可以判断当前日期是否在数组中
      return date.getDay() === 6 || date.getDay() === 0
    }
  }
}
</script>

<style lang="scss"  scoped>
 ::v-deep .el-calendar-day {
  height:  auto;
 }
 ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
::v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
::v-deep .el-calendar__header {
   display: none
 }
</style>
