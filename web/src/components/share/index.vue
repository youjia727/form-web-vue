<template>
  <div class="share-index">
    <el-dialog z-index="200" :title="title" :close-on-click-modal="false" :visible.sync="dialog" width="460px"
      :before-close="backIndex" :custom-class="show?'success-class':'nopadding'">
      <div class="top" v-if="show">
        <img src="../../../static/image/success.png" alt="success" />
        <p>创建成功，分享给好友填写吧</p>
      </div>
      <div class="share-type">
        <p>邀请方式</p>
        <div class="type-box">
          <div class="item" @click="clickLianJie">
            <img src="../../../static/image/lianjie.png" />
            <span>链接</span>
          </div>
          <div class="item" @click="clickQrCode">
            <img src="../../../static/image/qr-code.png" />
            <span>二维码</span>
          </div>
        </div>
      </div>
      <el-dialog width="600px" title="二维码分享" :visible.sync="innerVisible" custom-class="inner-success-class"
        append-to-body>
        <div class="qr-code-box">
          <div class="qrcode" id="picture" ref="qrCodeUrl"></div>
          <p class="form-name">{{title}}</p>
          <p class="form-s">微信扫码，使用「form表单」填写</p>
          <p class="save-qr-code" @click="savePic">保存二维码</p>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer" v-if="show">
        <p @click="backIndex" class="foot-p">
          <a-icon type="home" /><span>回到首页</span></p>
      </div>
    </el-dialog>
    <input type="text" ref="input" />
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      show: {
        type: Boolean,
        default: true
      },
      qid: {
        type: String,
        default: ''
      },
      dialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        innerVisible: false,
        count: 0
      }
    },
    methods: {
      clickLianJie() { //分享链接
        let query = ''
        if (this.qid) {
          query = '?qid=' + this.qid
        }
        this.$refs.input.value = 'https://test.com' + query
        this.$refs.input.select()
        document.execCommand("copy");
        this.$message.success('复制成功')
      },
      clickQrCode() { //二维码分享
        this.innerVisible = true
        this.count = this.count + 1
        if (this.count < 2) {
          this.$nextTick(() => {
            let query = ''
            if (this.qid) {
              query = '?qid=' + this.qid
            }
            let text = 'https://test.com' + query
            this.creatQrCode(text);
          })
        }
      },
      savePic() { //保存图片
        let myCanvas = document.getElementById('picture').getElementsByTagName('canvas');
        //创建一个a标签节点
        let a = document.createElement("a")
        //设置a标签的href属性（将canvas变成png图片）
        a.href = myCanvas[0].toDataURL('image/png')
        //设置下载文件的名字
        a.download = this.title
        //点击
        a.click()
      },
      creatQrCode(text) {
        var qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text: text, // 需要转换为二维码的内容
          width: 160,
          height: 160,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
      },
      backIndex() {
        this.$emit('close', false)
      }
    },
  }
</script>

<style lang="less" scoped="scoped">
  .top {
    text-align: center;
    padding-bottom: 30px;
    border-bottom: 1px solid #e7e9eb;

    img {
      width: 64px;
      height: auto;
      margin-bottom: 20px;
    }
  }

  .share-type {
    margin: 30px 0;

    >p {
      color: #333;
      margin-bottom: 25px;
    }

    .type-box {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        img {
          width: 52px;
          margin-bottom: 12px;
        }
      }
    }
  }

  .dialog-footer {
    padding: 30px 0;
    border-top: 1px solid #e7e9eb;
  }

  .foot-p {
    display: inline-block;
    color: #1488ed;
    cursor: pointer;

    span {
      display: inline-block;
    }

    i {
      margin-right: 4px;
    }
  }

  .qr-code-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 460px;

    .form-name {
      margin-top: 20px;
      color: #333;
      font-size: 16px;
      max-width: 390px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .form-s {
      line-height: 20px;
      color: #949aae;
      margin-top: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      text-align: center;
    }

    .save-qr-code {
      height: 36px;
      line-height: 36px;
      margin-top: 30px;
      text-align: center;
      border-radius: 2px;
      background-color: #1488ed;
      padding: 0 30px;
      color: #fff;
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -10;
  }
</style>
