<template>
  <div>
    <div id="chartWrapper" ref="myChart" />
  </div>
</template>

<script>
// 1. 引入库
// import * as echarts from 'echarts'

var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图

export default {
  // 由于需要处理 dom
  // 所以需要在 mounted 生命周期实现
  mounted() {
    // 2. 创建实例 init
    var myChart = echarts.init(this.$refs.myChart)
    // 3. 绘制图表 setOption 并传入配置对象
    myChart.setOption({
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '销售（Sales）', max: 6500 },
          { name: '管理（Administration）', max: 16000 },
          { name: '信息技术（Information Technology）', max: 30000 },
          { name: '客服（Customer Support）', max: 38000 },
          { name: '研发（Development）', max: 52000 },
          { name: '市场（Marketing）', max: 25000 }
        ]
      },
      color: ['#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#5470c6', '#91cc75', '#fac858'],
      series: [{
        type: 'radar',
        data: [
          {
            value: [4200, 200, 20000, 35000, 50000, 18000],
            name: '预算分配（Allocated Budget）'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '实际开销（Actual Spending）'
          },
          {
            value: [2000, 15000, 18000, 6000, 3000, 11000],
            name: '测试'
          }
        ]
      }]
    })
  }
}
</script>

<style>
#chartWrapper {
  width: 600px;
  height: 400px;
}
</style>
