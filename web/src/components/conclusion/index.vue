<template>
  <div :class="['conclusion', show ? '' : 'noHeight', isFocus && !show ? 'describe-wrap-isFocus' : '']" @click.stop="editInfo">
    <p class="conclusion_logo" v-if="show">
      <img src="../../../static/image/success.png" alt="success" />
      <span>提交成功</span>
    </p>
    <div class="conclusion_content">
      <a-textarea ref="textarea" :max-length="2000" :class="[justify_type===1?'left':'center']" auto-size :placeholder="placeholder"
        v-model="info">
      </a-textarea>
      <div class="justify-type">
        <div class="img">
          <img @click="onclick(1)" :class="[justify_type===1?'justify-active':'']" src="../../../static/image/left.png"
            align="左对齐" />
          <img @click="onclick(2)" :class="[justify_type===2?'justify-active':'']" src="../../../static/image/center.png"
            align="居中对齐" />
        </div>
        <a-popover placement="bottomLeft" overlayClassName="popover-type-box" v-model="showPopover" trigger="click">
          <div class="right">
            <a-icon type="picture" /> 添加图片
          </div>
          <div class="upload-select-box" slot="content">
            <p class="upload-select-item" @click.stop="uploadsLink">
              <a-icon type="ant-cloud" style="color: #1890FF;" />
              <span>链接图片</span>
            </p>
            <p class="upload-select-item" @click.stop="uploads">
              <a-icon type="credit-card" />
              <span>本地图片</span>
              <input ref="upload" type="file" :accept="accept" style="display: none;" @change="handleFile" />
            </p>
          </div>
        </a-popover>
      </div>
      <div class="img_box" v-if="img_url">
        <img v-if="img_url" :src="img_url" alt="img_name" />
        <div class="delete" @click="deleteimg">
          <i class="el-icon-delete"></i>删除
        </div>
      </div>
      <div class="footbox" v-if="show">
        <span @click="cancel">取消</span>
        <span @click="sure">确定</span>
      </div>
      <div class="link-model">
        <img-url-input @imgLinkCallBack="handleUploadSure" :visible.sync="showLinkModel"></img-url-input>
      </div>
    </div>
    <div ref="wrapResult"></div>
  </div>
</template>

<script>
  import imgUrlInput from '../imgUrlInput/index.vue'

  export default {
    components: {
      imgUrlInput
    },
    props: {
      infos: {
        type: Object,
        default: () => {}
      },
      placeholder: {
        type: String,
        default: '请输入自定义结束语内容'
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        accept: '.bmp,.jpg,.jpe,.jpeg,.pic,.png', //上传文件类型
        info: '',
        justify_type: 2, //居中，1，left
        img_url: '', //本地上传图片显示地址
        imgobj: {},
        isFocus: false,
        showPopover: false,
        showLinkModel: false
      }
    },
    created() {
      let that = this;
      document.addEventListener('click', function(e) {
        that.$emit('focusCallBack', false)
        that.fitData()
        that.isFocus = false
      }, false)
      let bool = this.show
      let obj = this.infos
      if (obj) {
        this.info = this.infos.content || ''
        this.justify_type = this.infos.justify_type === 'left' ? 1 : 2
        this.img_url = this.infos.img_url || ''
        this.imgobj = this.infos.image || {}
      }
      if (!bool) {
        setTimeout(() => {
          this.$refs.textarea.focus()
        }, 100)
      }
    },
    methods: {
      //结束语返回数据
      editInfo() {
        this.isFocus = true
        this.$emit('focusCallBack', true)
      },
      // 上传链接
      uploadsLink() {
        this.showLinkModel = true
        this.showPopover = false
      },
      // 上传本地
      uploads() {
        this.$refs.upload.click()
        this.showPopover = false
      },
      //获取链接数据
      handleUploadSure(url) {
        this.img_url = url
        // console.log(url)
      },
      fitData() {
        let obj = {
          justify_type: this.justify_type === 1 ? 'left' : 'center',
          content: this.info,
          image: this.imgobj,
          img_url: this.img_url
        }
        this.$emit('contentInfo', obj)
      },
      handleFile(e) {
        var file = e.target.files;
        let max = 2 * 1024 * 1024
        if (file[0].size > max) {
          this.$message.error('上传文件小于2M！')
          return false;
        }
        this.imgobj = file[0];
        var reader = new FileReader(); //读取文件
        reader.readAsDataURL(file[0]);
        reader.onload = () => {
          this.img_url = reader.result
        }
      },
      deleteimg() { //删除图片
        this.$confirm({
          title: '提示',
          content: '确认删除此图片?',
          okText: '确定',
          okType: 'danger',
          icon: 'info-circle',
          centered: true,
          cancelText: '取消',
          getContainer: () => this.$refs.wrapResult,
          onOk: () => {
            this.img_url = ''
            this.imgobj = {}
            this.$message.success('删除成功！');
          },
          onCancel: () => {},
        });
      },
      onclick(val) {
        this.justify_type = val
      },
      cancel() { //取消
        this.info = ''
        this.justify_type = 2 //居中，1，left
        this.img_url = '' //本地上传图片显示地址
        this.imgobj = {}
        this.$emit('cancel', false)
      },
      sure() { //确定
        this.fitData()
        this.cancel()
      }
    },
  }
</script>

<style scoped="scoped" lang="less">
  .conclusion {
    width: 776px;
    position: relative;
    min-height: calc(100vh - 252px);
    padding: 50px 0;
    text-align: center;
    background-color: #fff;
    border: 1px solid #e7e9eb;
    border-radius: 2px;
    box-sizing: content-box;
    margin: 0 auto;

    .conclusion_logo {
      display: flex;
      align-items: center;
      width: 120px;
      height: 40px;
      margin: 0 auto 24px;

      img {
        width: 40px;
        height: auto;
      }

      span {
        font-size: 16px;
        font-weight: 400;
        color: #767c85;
        margin-left: 16px;
      }
    }

    .conclusion_content {
      width: 480px;
      margin: 0 auto 100px;

      .justify-type {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;

        .img {
          img {
            width: 20px;
            padding: 2px;
            margin-right: 18px;
          }

          .justify-active {
            background-color: #f2f4f7;
          }
        }
      }

      .right {
        color: #1890ff;
        cursor: pointer;

        i {
          position: relative;
          top: -1px;
          width: 18px;
          height: auto;
          margin-right: 1px;
          vertical-align: middle;
        }
      }

      .img_box {
        display: inline-block;
        position: relative;
        max-width: 100%;
        margin: 24px auto 0;

        img {
          display: block;
          max-height: 276px;
          max-width: 100%;
          width: auto;
          margin-top: 6px;
          margin-bottom: 6px;
          cursor: pointer;
        }

        .delete {
          display: none;
          position: absolute;
          right: 0;
          bottom: 6px;
          width: 52px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          color: #fff;
          background-color: rgba(0, 0, 0, .4);
          cursor: pointer;

          i {
            margin-right: 2px;
          }

          &:hover {
            opacity: 0.6;
          }
        }

        &:hover .delete {
          display: block;
        }
      }
    }

    .footbox {
      display: flex;
      position: absolute;
      bottom: 80px;
      justify-content: center;
      left: 0;
      right: 0;

      span {
        display: inline-block;
        width: 68px;
        margin-right: 20px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0;
        border: 1px solid #e7e9eb;
        border-radius: 2px;
        cursor: pointer;

        &:last-of-type {
          border: none;
          background-color: #1890ff;
          color: #fff;
          margin-right: 0;

          &:hover {
            opacity: 0.8;
          }
        }

        &:first-of-type:hover {
          background-color: #f9fafd;
        }
      }
    }
  }

  .noHeight {
    min-height: auto;
    width: auto;
    margin-top: 0;
    padding: 12px 20px;
    border: none;

    .conclusion_content {
      width: auto;
      padding: 0 30px;
      box-sizing: border-box;
      margin: 0 auto;
    }
  }

  .describe-wrap-isFocus {
    box-shadow: 0 4px 16px 0 rgba(192, 198, 207, .5);
    transition: 0.2s;
  }
</style>
