<template>
  <div>
    <!--
      三个必填的属性
      action 必填, 但是后面我们用腾讯云所以就放一个 # 号即可
      list-type="picture-card" 决定样式
      file-list 是用来管理当前文件列表的, 是一个数组
     -->
    <!--
       附加功能
       on-preview 添加以后多了一个放大镜, 点击后自己写弹窗
       :class 在已经有一张图片的情况下, 不显示上传图标
      -->
    <!--
        交互钩子
        on-remove 删除
        on-change 修改 (不能用 on-success 因为根本没有上传)
        http-request 覆盖默认上传行为, 自定义上传实现
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

      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-progress v-if="showProgress" :percentage="percentage" style="width: 146px;" :show-text="false" />

    <el-dialog title="预览" :visible="showDialog" @close="showDialog = false">
      <img :src="previewUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
// 需要使用腾讯云的专用工具库上传图片
// 先安装和引入
import COS from 'cos-js-sdk-v5'
// 创建工具库实例, 带上一个配置对象, 记录 验证身份的 id 和 key
const cos = new COS({
  SecretId: 'AKIDDE0YqFve2A7oF2M3VjhPGsviEYd9OmDO',
  SecretKey: '5vthHjQwCE3dyBD0c0HI4jHbiZRSssQO'
})
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      previewUrl: '',
      percentage: 0,
      showProgress: false
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
      // 开始上传文件
      cos.putObject({
        // 储存桶名字
        Bucket: 'guangzhou60-1300310660',
        // 所在区域
        Region: 'ap-nanjing',
        // 要存在远程的文件名
        Key: Date.now() + data.file.name,
        // 储存类型, 固定写法
        StorageClass: 'STANDARD',
        // 文件本体
        Body: data.file,
        // 进度发生变化时的回调
        onProgress: (progressData) => {
          console.log(progressData)
          this.percentage = progressData.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        if (!err) {
          // 上传成功
          console.log('上传成功')
          console.log(data)
          // 这里是上传完毕的回调, 不确定什么时候执行
          // 要将后续处理放在这
          // 1. 将选中图片的 url 从本地图片换成线上地址
          this.fileList[0].url = 'http://' + data.Location
          // 2. 绿色成功小√显示出来
          this.fileList[0].status = 'success'

          setTimeout(() => {
            this.showProgress = false
          }, 1000)
        }
      })
    },
    beforeUpload(file) {
      // 上传之前校验图片的函数
      // 可以的到当前正在处理的图片本身
      console.log('这是上传前的校验')
      console.log(file)
      // 进行校验, 如果认为上传文件不对
      // 可以返回 false 进行主治

      // 1. 类型
      const type = ['image/jpeg', 'image/png']
      if (!type.includes(file.type)) {
        this.$message.warning('只接受 jpge / png 格式图片')
        return false
      }
      // 2. 大小
      // 控制不能发送 200 k 以上的图片
      const maxSize = 200 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.warning('图片大小不能超过 200 k')
        return false
      }

      this.showProgress = true

      return true
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
::v-deep img {
  object-fit: cover;
}
</style>
