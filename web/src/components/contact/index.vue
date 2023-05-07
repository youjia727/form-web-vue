<template>
  <div ref="contact-box" @click.stop="noChange">
    <a-modal :getContainer="() => $refs['contact-box']" centered width="700px" :title="title" v-bind="$attrs" v-on="$listeners"
      :maskClosable="false" @cancel="handleCancel" @ok="handleOk" cancelText="取消" okText="确定">
      <div class="attch-index">
        <p>1.支持一个选项关联一个或多个题目</p>
        <p>2.当填写者选中指定项时，被关联题目才会展示</p>
        <div class="options">
          <table class="attch-table">
            <thead>
              <tr>
                <td>选项</td>
                <td>关联题目</td>
              </tr>
            </thead>
            <tbody v-if="activeData && activeData.config.type === 'select' && activeData.options">
              <tr v-for="(item,idx) in activeData.options" :key="'item'+ idx">
                <td>{{item.label ? item.label : (item.set_other ? '其他' : '选项' + (idx + 1))}}</td>
                <td>
                  <a-popover :getPopupContainer="() => $refs['contact-box']" placement="bottom" overlayClassName="select-item-popover-type-box"
                    title="选择题目" v-model="showObj['optionVisible'+(idx+1)]" trigger="click">
                    <div class="attch-option">
                      <div class="attch-select">
                        <span v-if="!readerObj['renderArr'+(idx+1)] || !readerObj['renderArr'+(idx+1)].length">请设置关联题目</span>
                        <div v-else class="reader-info">
                          <p v-for="(items,i) in readerObj['renderArr'+(idx+1)].map(item => { return item.split('-')[1]}).sort((a,b)=>{
                            let m = a.split('.')[0]
                            let n = b.split('.')[0]
                            return m-n})"
                            :key="'items'+ i">{{items}}</p>
                        </div>
                      </div>
                      <i @click="showObj['optionVisible'+(idx+1)] = true" :class="[showObj['optionVisible'+(idx+1)]?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
                    </div>
                    <template slot="content">
                      <div class="select-contact">
                        <div class="contact-content-box" @touchmove.stop.prevent="()=>{return false;}">
                          <p class="game-over" v-if="checkboxList.length" @click="gameOver(idx)">
                            <a-icon :class="[gameOverObj['show'+(idx+1)]?'iconCheck':'iconNoCheck']" type="check" />
                            <span class="overinfo-one">直接结束</span><span class="overinfo-two">(填写者选中该选项后不显示后面的题目)</span></p>
                          <a-checkbox-group @change="checkboxChange($event,idx)" class="attch-check-box" v-model="checkObj['checkArr'+(idx+1)]">
                            <a-checkbox v-for="items in checkboxList" :key="'items' + items.qs_num + Math.random()"
                              :value="items.form_id + '-' + items.qs_num + '.' + items.label">{{items.qs_num + '.'}}{{items.label}}</a-checkbox>
                          </a-checkbox-group>
                        </div>
                        <div class="option-btn-box" style="text-align: right;margin-top: 12px;">
                          <a-button size="small" :disabled="(checkObj['checkArr'+(idx+1)] && checkObj['checkArr'+(idx+1)].length) || gameOverObj['show'+(idx+1)] ? false : true"
                            @click="cancelAttch(idx)">取消所有关联</a-button>
                          <a-button size="small" :disabled="!checkboxList.length" type="primary" @click="sureAttch(idx)">确定</a-button>
                        </div>
                      </div>
                    </template>
                  </a-popover>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import bus from '@/assets/busEvent/bus.js';

  export default {
    name: 'contact',
    props:{
      title:{
        type:String,
        default:''
      },
      activeData:{
        type:Object,
        default:()=>{}
      },
      list:{
        type:Array,
        default:()=>[]
      }
    },
    data() {
      return {
        showObj: {}, //显示题目的控制对象
        checkObj: {}, //题目关联的数组对象
        formList: [], //原表单数据
        echoList: [], //设置关联之后的表单数据
        checkboxList: [], //可以关联的题目
        readerObj: {}, //渲染页面的数据
        gameOverObj: {},
        activeIndex:0
      }
    },
    computed: {},
    filters: {
      fil(str) {
        if (!str) {
          return ''
        }
        return str.split('-')[1]
      }
    },
    created() {
      this.initData()
    },
    methods: {
      noChange() {},
      handleCancel() {
        this.$emit('update:visible', false)
      },
      handleOk() {
        bus.$emit('echoData', this.echoList)

        this.$emit('update:visible', false)
      },
      // 初始化数据
      initData() {
        this.checkboxList = []
        this.formList = JSON.parse(JSON.stringify(this.list))
        this.echoList = JSON.parse(JSON.stringify(this.list))
        if (!this.activeData) return;
        if (this.activeData.config.type === 'select' && this.activeData.options.length) {
          let arrs = this.activeData.options
          arrs.forEach((item, idx) => {
            let render = []
            let check = []
            let is_end = false
            if (item.jump_to.length) {
              render = item.jump_to;
              check = item.jump_to;
            } else {
              if (item.is_end) {
                is_end = true
                render = ['0000000-直接结束']
              }
            }
            this.$set(this.checkObj, 'checkArr' + (idx + 1), check)
            this.$set(this.readerObj, 'renderArr' + (idx + 1), render)
            this.$set(this.gameOverObj, 'show' + (idx + 1), is_end)
            this.$set(this.showObj, 'optionVisible' + (idx + 1), false)
          })
          let index = this.formList.findIndex(el => el.formId === this.activeData.formId)
          let arr1 = this.formList.slice(index + 1)
          arr1.forEach((item, i) => {
            let obj = {
              qs_num: index + i + 2,
              form_id: item.formId,
              label: item.config.label
            }
            this.checkboxList.push(obj)
          })
          this.activeIndex = index
        }
      },
      //直接结束操作
      gameOver(idx) {
        this.gameOverObj['show' + (idx + 1)] = !this.gameOverObj['show' + (idx + 1)]
        this.checkObj['checkArr' + (idx + 1)] = []
      },
      // 选中关联数据
      checkboxChange(arr, idx) {
        if (arr.length) {
          this.gameOverObj['show' + (idx + 1)] = false
        }
      },
      //取消关联
      cancelAttch(idx) {
        this.$set(this.checkObj, 'checkArr' + (idx + 1), [])
        this.gameOverObj['show' + (idx + 1)] = false
        this.sureAttch(idx)
      },
      //关联题目事件
      sureAttch(idx) {
        let arr = this.checkObj['checkArr' + (idx + 1)]
        let arr0 = arr.map((item, i) => {
          if (item.includes('直接结束')) {
            arr.splice(i, 1)
          } else {
            return item.split('-')[0]
          }
        })
        let newArr = JSON.parse(JSON.stringify(this.echoList))
        newArr[this.activeIndex].options[idx].jump_to = arr
        let is_end = false
        if (this.gameOverObj['show' + (idx + 1)]) {
          is_end = true
          arr = ['0000000-直接结束']
        }
        this.$set(newArr[this.activeIndex].options[idx], 'is_end', is_end)
        this.echoList = JSON.parse(JSON.stringify(newArr))
        this.$set(this.readerObj, 'renderArr' + (idx + 1), arr)
        this.$set(this.showObj, 'optionVisible' + (idx + 1), false)
      },
    }
  }
</script>

<style scoped="scoped" lang="less">
  p {
    margin-bottom: 0;
  }

  .attch-index {
    margin-top: -25px;
    padding-top: 20px;
    border-top: 1px solid #e8e8e8;

    .options {
      margin-top: 20px;
      border-top: 1px solid #e2e6ed;
      border-bottom: 1px solid #e2e6ed;

      .attch-table {
        table-layout: fixed;
        width: 100%;
        margin: -1px 0;
        border: 1px solid #e2e6ed;
        border-collapse: collapse;
        text-align: center;

        td {
          min-height: 33px;
          box-sizing: border-box;
        }

        thead {
          td {
            color: #3d4757;
            font-weight: 500;
            background-color: #f5f7f9;
            height: 33px;
            border: 1px solid #e2e6ed;
          }
        }

        tbody {
          td {
            color: #767c85;
            font-size: 12px;
            padding: 8px 10px;
            border: 1px solid #e2e6ed;
          }

          .attch-option {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            height: 100%;
            cursor: pointer;

            .attch-select {
              width: 95%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
</style>
