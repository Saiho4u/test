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
      <!-- <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template> -->
    </el-calendar>
  </div>
</template>

<script>
export default {
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

    }
  }
}
</script>

<style>

</style>
