<template>
  <div class="award-index">
    <div style="height: 10px;"></div>
    <el-scrollbar class="center-scrollbar">
      <div class="award-box">
        <p class="nav-tab">抽奖设置</p>
        <div class="award-setting">
          <div class="item-setting">
            <div class="title"><strong>抽奖标题</strong></div>
            <div class="title-box">
              <a-input class="title-input" @change="($event)=>{title = utils.filterValue($event,title,this)}" v-model="title"
                :max-length="15" placeholder="请输入抽奖标题"></a-input>
            </div>
          </div>
          <div class="item-setting" v-if="prizeList.length">
            <div class="title"><strong>奖品设置</strong></div>
            <div class="info">
              <ul class="prize-content">
                <li v-for="(item,idx) in prizeList" @click="idx===8?showAlert():addPrize(idx)" :key="'item'+idx" :class="['set_prize_pre',idx===8?'start':'',item.text==='感谢参与'?'':'setitem']">
                  <div v-if="idx === 8">
                    <p class="click-start">开始<br />抽奖</p>
                  </div>
                  <div class="prize-item-info" v-else>
                    <div class="add-box">
                      <a-icon type="plus" />
                      <p class="p2">设置奖品</p>
                    </div>
                    <div class="show-img">
                      <img v-if="item.img_url" :src="item.img_url" alt="" />
                      <!-- <img v-else src="../../../static/image/smile.png" /> -->
                    </div>
                    <p :class="['p1',item.img_url?'p3':(item.text!=='感谢参与'?'p4':'')]"><span class="number">{{item.number?item.number:''}}</span>
                      {{item.text}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="item-setting">
            <div class="title"><strong>中奖概率</strong></div>
            <div class="hit">
              <div class="radio">
                <a-radio-group size="small" v-model="hit_type">
                  <!-- <a-radio :value="1">每 <input :class="['input',error1?'error':'']" @blur="checkType(hit_num,1)" style="height: 26px;width: 44px;"
                      v-model="hit_num" />
                    个参与者抽中一个奖品 <span v-if="error1" class="error-text1">提示：参与者数为非0的正整数</span> </a-radio> -->
                  <a-radio :value="2">有 <select class="select" v-model="hit_lv">
                      <option v-for="item in hit_lv_list" :key="item">{{item}}</option>
                    </select> %的参与者可以抽中奖品</a-radio>
                </a-radio-group>
                <p style="margin-top: 10px;">
                  全部奖品每天最多抽中 <input :class="['input',error2?'error':'']" @blur="checkType(hit_num_max,2)" style="height: 26px;width: 44px;"
                    v-model.trim="hit_num_max" /> 个奖品（防止奖品一天就被领完）,可留空
                </p>
                <p class="error-text2" v-if="error2">提示：每天最多抽中个数为非0的正整数</p>
              </div>
            </div>
          </div>
          <div class="item-setting">
            <div class="title"><strong>抽奖条件</strong></div>
            <div class="hit">
              <a-checkbox v-model="option_allow_one">同一份问卷只允许抽奖一次</a-checkbox>
            </div>
          </div>
          <div class="prize-foot">
            <a-button @click="$router.go(-1)" style="margin-right: 40px;">取消</a-button>
            <a-button type="primary" @click="save">确定</a-button>
          </div>
          <div class="prize-dialog">
            <a-modal title="单个奖品设置" :maskClosable="false" :visible.sync="dialogVisible" width="580px" :footer="null"
              @cancel="handleClose">
              <a-form-model ref="form" :model="form" :layout="'vertical'" class="form">
                <a-form-model-item label="奖品类型">
                  <a-select v-model="form.type" placeholder="请选择奖品类型" style="width: 100%;">
                    <!-- <a-select-option value="实物奖品">实物奖品</a-select-option> -->
                    <a-select-option value="虚拟奖品">虚拟奖品</a-select-option>
                    <a-select-option value="优惠券">优惠券</a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item label="奖品名称" required>
                  <a-input @change="($event)=>{form.name = utils.filterValue($event,form.name,this)}" v-model="form.name"
                    :max-length="30" placeholder="请输入奖品名称"></a-input>
                </a-form-model-item>
                <a-form-model-item label="奖品数量" v-if="form.type !== '优惠券'" required>
                  <a-row>
                    <a-col :span="6">
                      <a-input @change="($event)=>{form.number = utils.filterValue($event,form.number,this)}" v-model="form.number"
                        :max-length="6" placeholder="请输入奖品数量"></a-input>
                    </a-col>
                    <a-col :span="2"><span style="height: 32px;line-height: 32px;">&nbsp;&nbsp;份</span></a-col>
                    <a-col :span="16" v-if="allcount">提示：共{{allcount}}份奖品，已有{{allcount - form.number}}人抽中此奖品</a-col>
                  </a-row>
                </a-form-model-item>
                <a-form-model-item v-if="form.type === '优惠券'" label="优惠券代码导入(最多导入1000个，抽完可继续追加)" required>
                  <p class="notice">每行只允许填写一个优惠券代码，并且不能重复</p>
                  <a-textarea :auto-size="{ minRows: 6, maxRows: 10}" v-model="form.coupons" placeholder="请输入优惠券代码"></a-textarea>
                </a-form-model-item>
                <a-form-model-item label="奖品图片设置">
                  <div class="img-link">
                    <span>1.图片链接地址</span>
                    <div class="link-img-box">
                      <a-textarea v-model="img_link_url" auto-size placeholder="请输入"></a-textarea>
                      <a-button type="primary" @click="linkSure">确认上传</a-button>
                    </div>
                  </div>
                  <p>2.本地上传</p>
                  <a-upload class="avatar-uploader" :accept="accept" action="" :show-file-list="false" :auto-upload="false"
                    :before-upload="()=>{return false;}" @change="onChange">
                    <div class="img_box" v-if="form.img_url">
                      <img v-if="form.img_url" :src="form.img_url" alt="img_name" class="avatar" />
                      <div class="delete" @click="deleteimg">
                        <i class="el-icon-delete"></i>删除
                      </div>
                    </div>
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </a-upload>
                </a-form-model-item>
                <a-form-model-item style="text-align: center;margin-top: 40px;">
                  <a-button v-if="num !== 8" style="margin-right: 20px;" @click="prizeList[num].set_item?deleter():handleClose()">{{prizeList[num].set_item?'删除':'取消'}}</a-button>
                  <a-button type="primary" @click="onSubmit">确定</a-button>
                </a-form-model-item>
              </a-form-model>
            </a-modal>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
  import utils from '@/assets/utils/db.js'

  export default {
    name: 'award',
    data() {
      return {
        utils,
        qid: '',
        is_lottery: false, //是否已设置抽奖
        dialogVisible: false, //添加商品的信息盒子
        imgShow: false, //查看图片
        disabled: false,
        prizeList: [],
        img_link_url: '',
        form: {
          type: '优惠券',
          name: '',
          number: '',
          img_url: '',
          coupons: ''
        },
        title: '', //抽奖的标题
        hit_type: 2, //命中类型
        hit_num: 10, //每隔多少中奖
        hit_lv: 50,
        hit_num_max: '',
        num: 8, //记录编辑的奖项
        hit_lv_list: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        error1: false,
        error2: false,
        allcount: '', //单个奖项设置的总数
        option_allow_one: true,
        accept: '.bmp,.jpg,.jpe,.jpeg,.pic,.png', //上传文件类型
      }
    },
    created() {
      let query = this.$route.query
      if (query.qid) {
        this.qid = query.qid
        this.echoLottery(query.qid)
      }
      this.setPrizeList()
    },
    methods: {
      async echoLottery(qid) {
        let param = {
          qid: qid
        }
        let res = await this.$http.echoLottery(param)
        if (res.code === 1 && res.data.is_lottery) {
          this.is_lottery = true
          let arr = res.data.list
          arr.push({
            text: '感谢参与',
            img_url: '',
            type: '',
            number: 0,
            index: 9,
            coupons_list: [],
            set_item: false
          })
          this.title = res.data.title
          this.prizeList = arr
          this.hit_lv = res.data.probability
          this.hit_num_max = res.data.everyday_num ? res.data.everyday_num : ''
          this.option_allow_one = res.data.option.option_allow_one
        } else {
          this.is_lottery = false
        }
      },
      setPrizeList() { //设置抽奖的项
        this.is_lottery = false
        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        arr.forEach(item => {
          let obj = {
            text: '感谢参与',
            img_url: '',
            type: '',
            number: 0,
            index: item + 1,
            coupons_list: [],
            set_item: false
          }
          this.prizeList.push(obj)
        })
      },
      addPrize(idx) { //点击添加商品
        this.num = idx
        this.form.type = this.prizeList[idx].type ? this.prizeList[idx].type : this.form.type
        this.form.name = this.prizeList[idx].text !== '感谢参与' ? this.prizeList[idx].text : ''
        this.form.img_url = this.prizeList[idx].img_url
        this.form.number = this.prizeList[idx].number ? this.prizeList[idx].number : ''
        this.allcount = this.prizeList[idx].all_count ? this.prizeList[idx].all_count : ''
        if (this.prizeList[idx].type === '优惠券') {
          this.form.coupons = this.prizeList[idx].coupons_list.join('\n')
        }
        this.dialogVisible = true
      },
      showAlert() { //提示
        this.$info({
          title: '提示',
          content: '此为预览状态不能抽奖！',
          centered: true,
          okText: '知道了',
          onOk() {},
        });
      },
      //确认链接上传图片
      linkSure() {
        this.form.img_url = this.img_link_url;
      },
      onChange(e) { //文件上传本地
        var file = e.file;
        let max = 2 * 1024 * 1024
        if (file.size > max) {
          this.$message.error('上传文件小于2M！')
          return false;
        }
        var reader = new FileReader(); //读取文件
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.form.img_url = reader.result
          this.img_link_url = ''
        }
      },
      deleteimg(e) { //删除图片
        this.form.img_url = ''
        e.stopPropagation();
      },
      cancelOption() { //取消
        this.dialogVisible = false
        setTimeout(() => {
          this.form.name = ''
          this.form.type = '优惠券'
          this.form.img_url = ''
          this.form.number = ''
          this.form.coupons = ''
          this.num = 8
        }, 100)
      },
      checkType(value, type) { //判断输入框的类型
        let reg = /^[0-9]*[1-9][0-9]*$/
        this.error1 = false
        this.error2 = false
        if (type === 1) {
          if (!reg.test(value)) {
            this.error1 = true
          }
        } else {
          if (value !== '' && !reg.test(value)) {
            this.error2 = true
          }
        }
      },
      save() { //保存抽奖信息
        if (this.is_lottery) {
          this.$info({
            title: '提示',
            content: '不能编辑已保存的抽奖！',
            centered: true,
            okText: '知道了',
            onOk() {},
          });
          return false
        }
        if (this.title === '') {
          this.$message.warning('提示：请设置抽奖的标题')
          return false
        }
        if (this.error1 || this.error2) {
          this.$message.warning('提示：中奖参与者数与最多奖品数应为正整数')
          return false
        }
        let arr = this.prizeList.slice(0, 8)
        let obj = {
          option_allow_one: this.option_allow_one
        }
        let param = {
          qid: this.qid ? this.qid : 0,
          title: this.title,
          prize_item: JSON.stringify(arr),
          probability: this.hit_lv,
          is_lottery: this.is_lottery,
          everyday_num: this.hit_num_max,
          option: JSON.stringify(obj)
        }
        this.$http.lotterySave(param).then(res => {
          if (res.code === 1) {
            this.$message.success(res.msg)
            sessionStorage.setItem('lid', res.data.id)
            this.$router.go(-1)
          }
        })
      },
      deleter() { //删除信息
        this.$confirm({
          title: '提示',
          content: '确认删除该奖品吗?',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          icon: '<Icon type="exclamation-circle">',
          centered: true,
          onOk: () => {
            let obj = {
              text: '感谢参与',
              img_url: '',
              type: '',
              number: 0,
              index: this.num + 1,
              set_item: false
            }
            this.prizeList[this.num] = obj
            this.cancelOption()
            this.$message.success('删除成功!');
          },
          onCancel: () => {},
        })
      },
      onSubmit() {
        if (this.form.name === '') {
          this.$message.info('提示：请填写奖品名称')
          return false;
        }

        let arr = []
        let newArr = []
        let couponsList = []

        if (this.form.type === '优惠券') {
          arr = this.form.coupons.split('\n')
          newArr = arr.filter(i => i && i.trim())
          couponsList = Array.from(new Set(newArr))
          this.form.number = couponsList.length
          if (couponsList.length > 1000) {
            this.$message.info('提示：优惠券代码最多导入1000个')
            return false
          }
        }

        let reg = /^[0-9]*[1-9][0-9]*$/
        if (!reg.test(this.form.number)) {
          this.$message.info(this.form.type === '优惠券' ? '提示：请输入优惠券代码' : '提示：请填写正确的奖品数量')
          return false;
        }
        this.prizeList[this.num].text = this.form.name
        this.prizeList[this.num].img_url = this.form.img_url
        this.prizeList[this.num].type = this.form.type
        if (this.form.type === '优惠券') {
          this.prizeList[this.num].coupons_list = couponsList
        } else {
          this.prizeList[this.num].coupons_list = []
        }
        this.prizeList[this.num].number = this.form.number
        this.prizeList[this.num].set_item = true
        this.cancelOption()
      },
      handleClose() {
        this.cancelOption()
      }
    },
  }
</script>

<style scoped="scoped" lang="less">
  .center-scrollbar {
    width: 760px;
    min-width: 400px;
    height: calc(100vh - 20px);
    margin: 0 auto;
    background-color: #fff;
    border-radius: 2px;
  }

  .award-box {
    padding: 20px;
    box-sizing: border-box;

    .nav-tab {
      height: 51px;
      line-height: 51px;
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid #e2e6ed;
    }

    .item-setting {
      display: flex;
      padding: 24px 0;
      border-bottom: 1px solid #e6e6e6;

      .title {
        width: 122px;
        margin-right: 20px;
        line-height: 28px;
      }

      .title-box {
        width: 462px;

        .title-input {
          box-shadow: none;
        }
      }

      .prize-content {
        position: relative;
        padding: 4px;
        width: 414px;
        height: 414px;
        background-color: #F5F5F5;
        border-radius: 10px;
        box-sizing: border-box;

        li {
          position: absolute;
          list-style: none;
          float: left;
          margin: 8px;
          margin-right: 0;
          width: 120px;
          height: 120px;
          background-color: #ffffff;
          border-radius: 4px;
          text-align: center;
          color: #1890FF;
          font-size: 14px;
          border: solid 1px #ffffff;
          box-sizing: content-box;
          word-break: break-word;
          cursor: pointer;

          .prize-item-info {
            position: relative;
          }

          p {
            margin-top: 46px;
          }

          .add-box {
            display: none;
            height: 120px;
          }

          .show-img {
            img {
              width: 54px;
              height: 54px;
              margin-top: 20px;
            }

            i {
              font-size: 16px;
              margin-top: 20px;
            }
          }

          .p3 {
            font-size: 14px;
            margin-top: 4px;
            padding: 0 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            box-sizing: border-box;
          }

          .p4 {
            margin-top: 0;
            height: 120px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            padding: 0 8px;
            box-sizing: border-box;
          }

          .number {
            position: absolute;
            top: 4px;
            right: 10px;
          }

          .click-start {
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            margin-top: 24px;
            letter-spacing: 4px;
            color: #fff;
          }

          &:nth-of-type(2) {
            left: 138px;
          }

          &:nth-of-type(3) {
            left: 272px;
          }

          &:nth-of-type(4) {
            top: 138px;
            left: 272px;
          }

          &:nth-of-type(5) {
            top: 272px;
            left: 272px;
          }

          &:nth-of-type(6) {
            top: 272px;
            left: 138px;
          }

          &:nth-of-type(7) {
            top: 272px;
          }

          &:nth-of-type(8) {
            top: 138px;
          }

          &:last-of-type {
            top: 138px;
            left: 138px;
          }

          &:not(.start):not(.setitem):hover {
            background-color: #E6F1FE;
            border: 1px solid #1890FF;


            p {
              font-size: 14px;
              margin-top: 6px;
            }

            .add-box {
              display: block;

              i {
                font-size: 16px;
                display: inline-block;
                margin-top: 42px;
              }
            }

            .p1 {
              display: none;
            }
          }
        }

        .start {
          background-color: #1890FF;
        }
      }

      .hit {
        .radio {
          position: relative;

          label {
            display: block;
            margin-top: 20px;

            &:first-of-type {
              margin-top: 6px;
            }
          }

          .input,
          .select {
            padding: 4px 10px;
            border: 1px solid #a9a8a8;
            outline: none;
          }

          .input:focus {
            border-color: #1890FF;
          }

          .error {
            border-color: #F56C6C;
          }

          .select {
            width: 66px;
            text-align: center;
          }

          .error-text1 {
            display: inline-block;
            margin-left: 10px;
            color: #F56C6C;
            font-size: 12px;
          }

          .error-text2 {
            position: absolute;
            bottom: -36px;
            left: 0;
            color: #F56C6C;
            font-size: 12px;
            background-color: #fff;
          }
        }
      }
    }
  }

  .form {
    padding: 0 20px;
    box-sizing: border-box;

    .notice {
      line-height: 20px;
      margin-top: -10px;
      color: #FF0000;
    }

    .avatar-uploader {
      display: inline-block;
      width: 120px;
      height: 120px;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border: 1px dashed #d9d9d9;
      transition: 0.2s;
    }

    .avatar-uploader:hover {
      background-color: #E6F1FE;
      border-color: #1890FF;

      .avatar-uploader-icon {
        color: #1890FF;
      }
    }

    .img_box {
      position: relative;
      width: 120px;
      height: 120px;
      z-index: 20;

      .delete {
        display: none;
        position: absolute;
        justify-content: center;
        align-items: center;
        right: 0;
        bottom: 0;
        width: 52px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        text-align: center;
        color: #fff;
        background-color: rgba(0, 0, 0, .4);
        cursor: pointer;
        z-index: 20;

        i {
          margin-right: 2px;
        }

        &:hover {
          opacity: 0.7;
        }
      }

      &:hover .delete {
        display: block;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }

    .avatar {
      width: 118px;
      height: 118px;
      display: block;
    }

    .img-link {
      .link-img-box {
        display: flex;
        margin: 10px 0;

        textarea {
          resize: none;
          margin-right: 10px;
        }
      }
    }
  }

  .prize-foot {
    margin: 40px 0 20px;
    text-align: center;
  }
</style>
