<template>
  <div class="form-box" @click.stop="watchFunction">
    <div class="form-index" v-show="!editShow">
      <div class="aside-left">
        <el-scrollbar class="aside-menu">
          <!-- <p class="components-title">考试题型</p>
          <div class="component-list">
            <ul class="component-body">
              <li v-for="(item,idx) in examComponent" :key="'item' + idx" @click.stop="addComponent(item)">
                <span>{{item.config.label}}</span>
              </li>
            </ul>
          </div> -->
          <p class="components-title">添加题目</p>
          <div class="component-list">
            <ul class="component-body">
              <li v-for="(item,idx) in titleListComponent" :key="'item' + idx" @click.stop="addComponent(item)">
                <a-icon :type="iconBack(item.config.type)" />
                <span>{{item.config.label}}</span>
              </li>
            </ul>
          </div>
          <p class="components-title">题目模板</p>
          <div class="component-list">
            <ul class="component-body">
              <li v-for="(item,idx) in commonUserComponent" :key="'item' + idx" @click.stop="addComponent(item)">
                <span>{{item.config.label}}</span>
              </li>
            </ul>
          </div>
          <p class="components-title">
            <span>我的常用题</span>
            <span v-if="mineUserComponent.length" class="edit-common" @click="commonUseShow = true">管理</span>
          </p>
          <div class="component-list">
            <ul class="component-body" v-if="mineUserComponent.length">
              <li v-for="(el,idx) in mineUserComponent" :key="'element' + idx" @click.stop="addComponent(el.field_item)" :title="el.name">
                <span class="common-item">{{el.name}}</span>
              </li>
            </ul>
            <div class="component-body add-mine-user-box" v-else>
              <span>暂无我的常用，立即</span><span @click="commonUseShow = true">&nbsp;添加</span>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="main-center">
        <el-scrollbar ref="scroll" class="center-scrollbar">
          <div class="form-header">
            <p v-if="!is_edit_title" class="form-title" @click="editTitle">{{title?title:'请输入表单标题'}}</p>
            <input ref="input" type="text" maxlength="30" v-if="is_edit_title" class="title-input" v-model="title" @blur="titleBlur" />
            <div class="describe-box">
              <p class="describe" :style="{'text-align':describeContent.justify_type==='left'?'left':'center'}" v-show="!describeBoxShow"
                @click.stop="editDescrible">{{describeContent.content ? describeContent.content : '请设置描述'}}</p>
              <img v-if="!describeBoxShow && describeContent.img_url" :src="describeContent.img_url" alt="描述插入的图片" />
              <div class="describe-wrap" v-show="describeBoxShow">
                <conclusion ref="conclus" @focusCallBack="(bool)=>{describeBoxShow = bool}" :infos="describeContent"
                  @contentInfo="getTitleInfo" :placeholder="'请输入设置描述'" :show="false"></conclusion>
              </div>
            </div>
          </div>
          <div class="form-content">
            <form-item ref="formItem" @formListCallBack="echoFormList" @focusForm="formEditShow" :list="formList"></form-item>
            <div v-show="!formList.length" class="empty-info">
              从左侧点选添加进行表单设计
            </div>
          </div>
          <div class="end">
            <a-divider dashed>
              <span class="span" @click="editShow = true">
                <a-icon type="edit" /> 自定义结束语</span>
            </a-divider>
          </div>
          <div ref="bottom"></div>
        </el-scrollbar>
      </div>
      <div class="aside-right">
        <div class="right-menu-box">
          <div class="date-rang">
            <div class="range-item">
              <span class="option">开始时间</span>
              <a-date-picker style="width: calc(100% - 62px);" v-model="startValue" :disabled-date="disabledStartDate"
                :showToday="false" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="开始时间" />
            </div>
            <div class="range-item">
              <span class="option">截止时间</span>
              <a-date-picker style="width: calc(100% - 62px);" v-model="endValue" :disabled-date="disabledEndDate"
                :showToday="false" format="YYYY-MM-DD" valueFormat="YYYY-MM-DD" placeholder="截止时间" />
            </div>
            <div class="range-item">
              <span class="option">发布状态</span>
              <a-switch style="float: right;position: relative;top: 2px;" size="small" v-model="publish_type" />
            </div>
          </div>
          <!-- <div class="item-setting" @click="prizeSet">
            <span class="option">抽奖设置</span>
            <span class="notices">（可设置“抽奖题目”、“内容”等）</span>
            <a-icon type="gift" />
          </div> -->
          <div class="item-setting preview-save">
            <span class="preview" @click="preview">预览</span>
            <span v-if="!isEdit" class="save" @click="submit">完成创建</span>
            <span v-else :class="['save',publish?'gary':'']" @click="publish?'':submit()">完成创建</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="commonUseShow">
      <common-use :visible.sync="commonUseShow"></common-use>
    </div>
    <div class="end-info" v-if="editShow">
      <conclusion @cancel="(bool)=>{editShow = bool}" @contentInfo="(endData)=>{endInfo = endData}" :infos="endInfo"></conclusion>
    </div>
    <div v-if="dialogShow">
      <share :qid="qid" :title="title" :dialog="dialogShow" @close="backIndex"></share>
    </div>
    <div class="preview-box">
      <a-drawer wrapClassName="preview-drawer" :destroyOnClose="true" :closable="false" :mask="false" :maskClosable="false"
        :width="'100vw'" placement="right" :visible="drawerShow">
        <div class="preview-top">
          <div class="close-btn" title="返回" @click="()=>{drawerShow =false}">
            <a-icon type="close" />
          </div>
        </div>
        <div style="height: calc(100vh - 48px);margin-top: 8px;box-sizing: border-box;">
          <preview @close="(bool)=>{drawerShow = bool}" :describe-content="describeContent" :list="formList" :title="title"></preview>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  import {
    titleListComponent,
    commonUserComponent,
    examComponent
  } from '@/assets/formConfig/menuConfig.js'
  import commonUse from '@/components/commonUse/index.vue'
  import {
    iconCallback
  } from '@/assets/formConfig/icon.js'
  import utils from '@/assets/utils/db.js'
  import bus from '@/assets/busEvent/bus.js';
  import conclusion from '@/components/conclusion/index.vue'
  import formItem from '@/components/formItem/index.vue'
  import preview from '@/components/preview/index.vue'
  import share from '@/components/share/index.vue'


  export default {
    name: 'form-edit',
    components: {
      commonUse,
      conclusion,
      formItem,
      preview,
      share
    },
    data() {
      return {
        moment,
        utils,
        titleListComponent, //左侧菜单栏组件
        commonUserComponent, //题目模板
        // mineUserComponent: [], //常用题
        examComponent,//考试题型
        qid: '',
        isEdit: false, //是否已经创建修改表单
        editShow: false, //是否修改结束语
        formList: [], //表单列表数据
        is_edit_title: false, //是否修改标题
        describeBoxShow: false, //设置标题描述
        title: '',
        describeContent: {}, //描述的内容
        endInfo: {}, //结束语内容
        startValue: null, //开始时间
        endValue: null, //结束时间
        publish_type: false, //发布状态
        drawerShow: false, //预览页面控制
        dialogShow: false, //控制分享弹框
        showTotal: false, //编辑时候是否显示提示框
        publish: false, //是否已经创建
        commonUseShow: false //显示常用题的model
      }
    },
    computed: {
      mineUserComponent: {
        get() {
          if (!this.$store.state.base.listShow) {
            return this.$store.dispatch('base/getCommonUse').then(res=>{
              return this.$store.state.base.list
            })
          } else {
            return this.$store.state.base.list
          }
        },
        set(value) {}
      }
    },
    created() {
      let query = this.$route.query
      let formData = sessionStorage.getItem('djs-form-data')
      if (formData) {
        formData = JSON.parse(formData)
        this.startValue = formData.startValue
        this.endValue = formData.endValue
        this.title = formData.title
        this.describeContent = formData.describeContent
        this.endInfo = formData.endInfo
        this.publish_type = formData.publish_type
        this.formList = formData.formList
      } else {
        if (Object.keys(query).length) {
          //编辑时候发送请求数据
          this.isEdit = true
          this.qid = query.id
          this.getFormList(query.id)
        } else {
          let item = this.utils.deepClone(this.commonUserComponent[0])
          this.$set(item, 'formId', '0000000000001')
          this.$set(item, 'vModel', 'filed0000000000001')
          this.formList.push(item)
        }
      }
      bus.$on('echoData', (val) => {
        this.formList = JSON.parse(JSON.stringify(val))
      })
    },
    methods: {
      // 监听点击事件
      watchFunction() {
        if (this.$refs['formItem']) {
          this.formEditShow()
          this.$refs['formItem'].blurActiveCallBack()
        }
      },
      //限制开始时间
      disabledStartDate(startValue) {
        const endValue = this.endValue;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      },
      //限制结束时间
      disabledEndDate(endValue) {
        const startValue = this.startValue;
        if (!endValue || !startValue) {
          return false;
        }
        return startValue.valueOf() >= endValue.valueOf();
      },
      //获取表单数据
      async getFormList(id) {
        let param = {
          qid: id
        }
        let res = await this.$http.getformList(param)
        if (res.code === 0) {
          let result = res.data
          this.formList = result.formList
          this.title = result.name
          this.startValue = result.start_time
          this.endValue = result.end_time
          this.describeContent = result.description
          this.endInfo = result.conclusion
          this.publish_type = result.publish
          this.publish = result.publish
          this.showTotal = false
        }
      },
      //点击修改标题
      editTitle() {
        this.is_edit_title = true
        setTimeout(() => {
          this.$refs.input.focus()
        }, 100)
      },
      //点击修改描述
      editDescrible() {
        this.$refs.conclus.isFocus = true
        this.$refs.formItem.activeIndex = null
        this.describeBoxShow = true
      },
      //获取描述信息
      getTitleInfo(val) {
        this.describeContent = val
      },
      //设置表土失去焦点
      titleBlur() {
        this.title = this.title.replace(/(^\s+)|(\s+$)/g, "")
        this.is_edit_title = false
      },
      //编辑表单时候回显数据
      formEditShow(bool) {
        this.describeBoxShow = false
        this.$refs.conclus.fitData()
        this.$refs.conclus.isFocus = false
      },
      //添加题目
      addComponent(item, type) {
        let clone = this.utils.deepClone(item)
        let items = this.createIdAndKey(clone)
        this.formList.push(items)
        this.$refs.formItem.onClick(this.formList.length - 1)
        this.goScrollBottom()
      },
      //给表单项设置唯一的标识
      createIdAndKey(item) {
        let time = Date.now()
        this.$set(item, 'formId', time)
        this.$set(item, 'vModel', 'filed' + time)
        return item
      },
      //修改题目内容的回显赋值
      echoFormList(list) {
        this.formList = this.utils.deepClone(list)
      },
      //左侧图标筛选
      iconBack(type) {
        return iconCallback(type)
      },
      //抽奖设置
      prizeSet() {
        let formData = {
          title: this.title,
          describeContent: this.describeContent,
          endInfo: this.endInfo,
          startValue: this.startValue,
          endValue: this.endValue,
          publish_type: this.publish_type,
          formList: this.formList
        }
        sessionStorage.setItem('djs-form-data', JSON.stringify(formData))
        if (this.qid) {
          this.$router.push({
            path: '/form/prize-setting',
            query: {
              qid: this.qid
            }
          })
        } else {
          this.$router.push('/form/prize-setting')
        }
      },
      //预览页面
      preview() {
        this.$refs.conclus.fitData()
        if (this.checkSetformList()) {
          this.drawerShow = true
        }
      },
      //验证答题时间
      checkDate() {
        let bool = true
        if (!this.startValue || !this.endValue) {
          this.$message.info('提示：请设置答题时间')
          bool = false
        }
        return bool
      },
      //完成创建
      submit() {
        setTimeout(() => {
          this.save()
        }, 50)
      },
      async save() {
        if (!this.checkDate() || !this.checkSetformList()) return;
        let param = {
          name: this.title,
          start_time: this.startValue,
          end_time: this.endValue,
          publish: this.publish_type,
          description: JSON.stringify(this.describeContent),
          formList: JSON.stringify(this.formList),
          conclusion: JSON.stringify(this.endInfo),
        }
        if (this.qid) {
          param.qid = this.qid
        }
        let res = await this.$http.formSave(param)
        if (res.code === 0) {
          sessionStorage.removeItem('djs-form-data')
          this.qid = res.data.qid
          this.dialogShow = true
        }
      },
      //编辑表单保存
      // editSave() {
      //   if (!this.checkDate() || !this.checkSetformList()) return;
      //   if (this.showTotal) {
      //     this.$confirm({
      //       title: '提示',
      //       content: '此表单正在收集，修改后之前的数据将被删除。是否继续？',
      //       okText: '确定',
      //       cancelText: '取消',
      //       icon: '<Icon type="exclamation-circle">',
      //       centered: true,
      //       onOk: () => {
      //         setTimeout(() => {
      //           this.submitFunction()
      //         }, 50)
      //       },
      //       onCancel: () => {},
      //     })
      //   } else {
      //     setTimeout(() => {
      //       this.submitFunction()
      //     }, 50)
      //   }
      // },
      //编辑表单提交数据接口
      // async submitFunction() {
      //   let param = {
      //     qid: this.qid,
      //     name: this.title,
      //     creator_id: 0,
      //     start_time: this.startValue,
      //     end_time: this.endValue,
      //     publish: this.publish_type,
      //     option_item: '',
      //     description: JSON.stringify(this.describeContent),
      //     formList: JSON.stringify(this.formList),
      //     conclusion: JSON.stringify(this.endInfo),
      //     questionnaire_is_edit: this.showTotal
      //   }
      //   let res = await this.$http.editform(param)
      //   if (res.code === 1) {
      //     sessionStorage.removeItem('djs-form-data')
      //     this.dialogShow = true
      //   }
      // },
      backIndex(val) {
        this.dialogShow = false
        this.$router.push('/form')
      },
      //检查是否设置题目
      checkSetformList() {
        let error = false
        if (!this.title.length) {
          this.$refs['scroll'].wrap.scrollTop = 0
          this.$message.info('请输入表单标题')
          return false;
        }
        this.formList.some((item, idx) => {
          if (item.config.type === 'select' && item.config.tag !== 'checkbox') {
            item.min = null
            item.max = null
          }
          if (!item.config.label.length) {
            this.$message.info('问题不能为空，请输入')
            error = true
            return error
          } else {
            if (item.config.type === 'select') {
              let option = []
              if (item.config.tag === 'dropdown') {
                option = item.options.filter(el => !el.label && !el.set_other)
              } else {
                option = item.options.filter(el => !el.label && !el.img_url && !el.set_other)
              }
              if (option.length) {
                this.$message.info('第 ' + (idx + 1) + ' 题的选项不能为空，请输入')
                error = true
                return error
              }
            } else if (item.config.type === 'multiple-input' && !item.config.qs_detail.length) {
              this.$message.info('填空题不能为空，请输入')
              error = true
              return error
            }
          }
        })
        return !error;
      },
      //滚动到底部
      goScrollBottom() {
        this.$nextTick(() => {
          this.$refs['scroll'].wrap.scrollTop = this.$refs['bottom'].offsetTop
        })
      }
    }
  }
</script>

<style lang="less" scoped="scoped">
  .form-index {
    display: flex;
    align-items: flex-start;
    padding: 10px 16px;
    box-sizing: border-box;
    max-width: 1340px;
    margin: 0 auto;
  }

  .aside-left {
    width: 212px;
    min-width: 212px;
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid #e7e9eb;
    color: #3d4757;

    .aside-menu {

      .components-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 20px;
        color: #3d4757;
        font-weight: 700;
        margin-bottom: 10px;

        .edit-common {
          color: #1890FF;
          cursor: pointer;
        }
      }

      .component-list {
        .component-body {
          display: flex;
          flex-wrap: wrap;
          -webkit-box-pack: justify;
          justify-content: space-between;
          margin-bottom: 16px;

          li {
            display: flex;
            justify-content: center;
            align-items: center;
            width: calc((100% - 10px)/2);
            height: 28px;
            margin: 5px 0;
            color: #3d4757;
            font-size: 12px;
            border-radius: 2px;
            border: 1px solid #e2e6ed;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;

            a {
              display: flex;
              justify-content: center;
              align-items: center;
            }

            i {
              font-size: 14px;
              margin-right: 4px;
            }

            &:hover {
              color: #1488ed;
              border: 1px solid #1488ed;
            }
          }

          .common-item {
            display: block;
            padding: 0 6px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            box-sizing: border-box;
          }
        }

        .add-mine-user-box {
          display: block;
          font-size: 12px;
          padding-left: 15px;
          padding-bottom: 2px;

          span {
            display: inline-block;
            padding: 4px 0;

            &:last-of-type {
              color: #1890FF;
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .main-center {
    width: calc(100% - 500px);
    min-width: 520px;
    margin: 0 16px;
    border: 1px solid #e7e9eb;
    background-color: #fff;

    .center-scrollbar {
      height: calc(100vh - 22px);
      overflow: hidden;
      box-sizing: border-box;
    }

    .form-header {
      width: 90%;
      margin: 40px auto 0;
      box-sizing: border-box;
      text-align: center;

      .form-title {
        min-height: 26px;
        line-height: 26px;
        font-size: 20px !important;
        font-weight: 700;
        color: #3d4757;
        cursor: pointer;
      }

      .title-input {
        font-size: 20px;
        font-weight: 700;
        color: #3d4757;
        height: 26px;
        line-height: 26px;
        width: 100%;
        border: none;
        text-align: center;
        outline: none;
      }

      .describe-box {
        margin-top: 28px;

        img {
          margin-top: 15px;
          max-height: 276px;
          max-width: 80%;
          width: auto;
        }

        .describe {
          margin: 40px 0 0px;
          padding: 4px 20px;
          box-sizing: border-box;
          border: 1px solid #fff;
          color: #757677;

          &:hover {
            border-bottom: 1px solid rgba(25, 55, 88, 0.2);
          }
        }
      }
    }

    .form-content {
      margin-top: 30px;

      .empty-info {
        width: 90%;
        margin: 0 auto;
        text-align: center;
        font-size: 16px;
        color: #1890FF;
        letter-spacing: 2px;
      }
    }

    .end {
      margin: 40px 0 60px;
      padding: 0 30px;
      box-sizing: border-box;

      .span {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        padding: 0 20px;
        border-radius: 20px;
        transition: 0.2s;
        cursor: pointer;

        i {
          margin-right: 4px;
        }

        &:hover {
          color: #1488ed;
          background-color: #f8f8f8;
        }
      }
    }
  }

  .aside-right {
    width: 290px;
    min-width: 290px;

    .date-rang {
      padding: 20px 15px;
      margin-bottom: 10px;
      background-color: #fff;
      border: 1px solid #e2e6ed;

      .range-item {
        margin-bottom: 20px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }

    .item-setting {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      padding: 20px 15px;
      border: 1px solid #e2e6ed;
      margin-bottom: 10px;
      cursor: pointer;

      .option {
        font-weight: 600;
      }

      .notices {
        font-size: 12px;
        color: #aeb5c0;
      }

      i {
        float: right;
        font-size: 14px;
        color: #aeb5c0;
      }

      &:last-of-type {
        margin-bottom: 0
      }
    }

    .preview-save {
      padding: 0;
      background-color: transparent;
      border: none;

      span {
        flex: 1;
        text-align: center;
        height: 32px;
        line-height: 32px;
        border-radius: 2px;
        border: 1px solid #e2e6ed;
        background-color: #fff;
        overflow: hidden;

        &:hover {
          opacity: 0.8;
        }
      }

      .save {
        color: #fff;
        margin-left: 10px;
        background-color: #1890FF;
        border: none;
      }

      .gary {
        background-color: #A6A9AD;
        cursor: default;
      }
    }
  }

  .end-info {
    padding-top: 10px;
  }
</style>
