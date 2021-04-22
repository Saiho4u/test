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

      :on-preview="preview"
      :class="{disable: fileList.length > 0}"

      :on-remove="onRemove"
      :on-change="onChange"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog title="图兰" :visible="showDialog" @close="showDialog = false">
      <img :src="previewUrl" alt="">
    </el-dialog>
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
      ],
      showDialog: false,
      previewUrl: ''
    }
  },
  methods: {
    preview(file) {
      console.log(file)
      this.previewUrl = file.url
      this.showDialog = true
    },
    onRemove(file, fileList) {
      // 两个参数
      // 1. file 是当前被删除的图片
      // 2. fileList 是当前图片删除完之后的最新数组
      // console.log(this.fileList)
      // console.log(fileList)
      this.fileList = [...fileList]
    },
    onChange(file, fileList) {
      // 1. file 是变更的文件本身
      // 2. fileList 是最新的数组结果
      this.fileList = [...fileList]
    },
    upload(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.disable {
  // less 穿透写法 /deep/
  // scss 穿透写法 ::v-deep
  // css 穿透写法是 >>>
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
