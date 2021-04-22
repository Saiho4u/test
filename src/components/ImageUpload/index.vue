<template>
  <div>
    <!--
      action 必填, 但是后面我们用腾讯云所以就放一个 # 号即可
      list-type="picture-card" 决定样式

      file-list 是用来管理当前文件列表的, 是一个数组
     -->
    <el-upload
      action="#"
      list-type="picture-card"
      :file-list="fileList"
    >
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        // 这里是存放文件列表的地方
        // 其中每张图片都是一个对象
        // 最重要的属性 url
        {
          url: 'https://img1.baidu.com/it/u=145965533,3075282827&fm=26&fmt=auto&gp=0.jpg'
        }
      ]
    }
  }
}
</script>

<style>

</style>
