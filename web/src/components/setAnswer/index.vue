<template>
  <div class="answer-box" ref="answer-box" @click.stop="()=>{}">
    <a-modal width="600px" :destroyOnClose="true" :getContainer="() => $refs['answer-box']" :maskClosable="false"
      okText="确定" cancelText="取消" dialog-class="label-class" centered v-bind="$attrs" v-on="$listeners" title="设置考试答案"
      @cancel="handleCancel" @ok="handleUploadSure">
      <div class="preview-index">
        <a-form-model :layout="'vertical'" :model="form" ref="ruleForm">
          <el-scrollbar class="set-answer-item">
            <a-form-model-item class="answer-form-item" :prop="`${item.vModel}.value`">
              <!-- 标题部分数据显示 -->
              <div class="item-title-box">
                <sup class="require-nbsp" v-if="item.config.required">*</sup>
                <p class="title">{{item.config.label}}</p>
                <p v-if="item.showQsDescribe && item.config.qs_describe.length" class="preview-describe">{{item.config.qs_describe}}</p>
                <p v-if="item.config.title_img_url" class="title-img-box"><img style="max-height: 230px;" :src="item.config.title_img_url"
                    alt="标题图片" />
                </p>
              </div>

              <!-- 文本类型 -->
              <template v-if="item.config.type === 'input'">
                <a-textarea @input="($event)=>{form[item.vModel].value = utils.filterValue($event,form[item.vModel].value,this)}"
                  v-model="form[item.vModel].value" placeholder="请输入答案关键词，多个关键词使用#号分隔" :auto-size="{ minRows: 3,maxRows:6 }" allowClear />
              </template>

              <!-- 单选题 -->
              <template v-if="item.config.tag === 'radio' || item.config.tag === 'dropdown'">
                <a-radio-group v-model="form[item.vModel].value">
                  <div class="item-option-select" v-for="(optionItem,optionIdx) in item.options" :key="'optionItem' + optionIdx">
                    <a-radio @click="radioClick(item.vModel,item.options,optionIdx)" v-if="!optionItem.set_other"
                      :value="optionItem.options_id">
                      <span v-if="optionItem.label.length || !optionItem.img_url">{{optionItem.label ? optionItem.label : '选项' + (optionIdx + 1)}}</span>
                      <img class="preview-option-img" v-if="item.config.tag !== 'dropdown' && optionItem.img_url" :src="optionItem.img_url"
                        alt="选项图片" />
                    </a-radio>
                    <div style="font-size: 12px;color: #F20D0D;" v-else>提示：“其他” 选项不在考试答案的设置范围内</div>
                  </div>
                </a-radio-group>
              </template>

              <!-- 多选题 -->
              <template v-if="item.config.tag === 'checkbox'">
                <a-checkbox-group v-model="form[item.vModel].value">
                  <div class="item-option-select" v-for="(optionItem,optionIdx) in item.options" :key="'optionItem' + optionIdx">
                    <a-checkbox v-if="!optionItem.set_other" :value="optionItem.options_id">
                      <span v-if="optionItem.label.length || !optionItem.img_url">{{optionItem.label ? optionItem.label : '选项' + (optionIdx + 1)}}</span>
                      <img class="preview-option-img" v-if="optionItem.img_url" :src="optionItem.img_url" alt="选项图片" />
                    </a-checkbox>
                    <div style="font-size: 12px;color: #F20D0D;" v-else>提示：“其他” 选项不在考试答案的设置范围内</div>
                  </div>
                </a-checkbox-group>
              </template>

              <!-- 多段填空 -->
              <template v-if="item.config.tag === 'multiple-input'">
                <p style="margin-bottom: 40px;">{{item.config.qs_detail}}</p>
                <li class="answer-multiple-item" v-for="(inputItem,inputIdx) in filterMultipleInput(item.config.qs_detail)"
                  :key="'inputItem' + inputIdx">
                  <span v-if="inputItem.is_show_input">{{inputIdx + 1 + '、'}}</span>
                  <a-textarea @input="($event)=>{form[item.vModel].value[inputIdx] = utils.filterValue($event,form[item.vModel].value[inputIdx],this)}"
                    v-if="inputItem.is_show_input" v-model="form[item.vModel].value[inputIdx]" placeholder="请输入关键词，多个关键词使用#号分隔"
                    :auto-size="{ minRows: 1,maxRows:6 }" allowClear />
                </li>
              </template>

            </a-form-model-item>
          </el-scrollbar>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import utils from '@/assets/utils/db.js'
  export default {
    props: {
      activeData: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        utils,
        form: {},
        item: {}
      }
    },
    created() {
      this.item = JSON.parse(JSON.stringify(this.activeData))
      this.echoForm(this.item)
    },
    methods: {
      //动态创建form数据
      echoForm(item) {
        let formItem = {
          value: '',
          tag: item.config.tag,
          type: item.config.type,
          required: item.config.required
        }
        switch (item.config.tag) {
          case 'checkbox':
            formItem.value = item.answerData
            break;
          case 'multiple-input':
            let num = item.config.qs_detail.split('＿＿＿＿').length - 1
            let arr = []
            for (let i = 0; i < num; i++) {
              arr[i] = item.answerData[i] ? item.answerData[i].join('#') : ''
            }
            formItem.value = arr
            break;
          default:
            let checkArr = ['radio','dropdown']
            if (checkArr.includes(item.config.tag)) {
              formItem.value = item.answerData[0]
            } else {
              formItem.value = item.answerData.join('#')
            }
            break;

        }
        this.$set(this.form, item.vModel, formItem)
      },
      // 选择题再次点击取消选中
      radioClick(vModel, options, optionIdx) {
        let optionValue = options[optionIdx].options_id;
        if (this.form[vModel].value === optionValue) {
          this.form[vModel].value = ''
          this.form[vModel].other_input = ''
        }
      },
      //筛选多段填空题
      filterMultipleInput(qsTitle) {
        let arr = []
        if (qsTitle.length) {
          let arr1 = qsTitle.split('＿＿＿＿')
          let input_num = arr1.length - 1
          arr1.forEach((item, idx) => {
            if (item || idx + 1 <= input_num) {
              let obj = {
                text: item,
                is_show_input: idx + 1 <= input_num ? true : false
              }
              arr.push(obj)
            }
          })
        }
        return arr
      },
      // 确定
      handleUploadSure() {
        let vModel = this.activeData.vModel
        this.$emit('setAnswerCallBack', this.form[vModel])
        this.handleCancel()
      },
      // 取消
      handleCancel() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  .answer-box textarea {
    padding: 4px 10px;
    resize: none;
  }

  .answer-form-item {
    padding: 0 20px;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .answer-multiple-item {
    display: flex;
    margin-top: 10px;

    span {
      margin-right: 2px;
      line-height: 28px;
    }
  }
</style>
