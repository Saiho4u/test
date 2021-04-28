<template>
  <div>
    <div id="chartWrapper" ref="myChart" />
  </div>
</template>

<script>
// 1. 引入库
import * as echarts from 'echarts'

export default {
  // 由于需要处理 dom
  // 所以需要在 mounted 生命周期实现
  mounted() {
    // 2. 创建实例 init
    var myChart = echarts.init(this.$refs.myChart)
    // 3. 绘制图表 setOption 并传入配置对象
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
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
