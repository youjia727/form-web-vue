<template>
  <div class="select-box">
    <div class="multiple-box">
      <a-textarea @input="($event)=>{item.config.qs_detail = utils.filterValue($event,item.config.qs_detail,this)}"
        :ref="'multipleType'" auto-size v-model="item.config.qs_detail" placeholder="请输入问题(请在需要作答部分插入填空符)"></a-textarea>
    </div>
    <div class="select-option-setting" v-show="show">
      <div class="add-option-item" @click.stop="addOperator">
        <a-icon type="plus-circle" />
        <span>添加填空符</span>
      </div>
      <!-- <span class="split-add">|</span>
      <div class="add-option-item" @click.stop="setAnswer(idx)">
        <span>{{item.answerData && item.answerData.length ? '编辑答案' : '设置题目答案'}}</span>
      </div> -->
    </div>
  </div>
</template>

<script>
  import utils from '@/assets/utils/db.js'

  export default {
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        utils
      }
    },
    created() {},
    methods: {
      //增加填空符
      addOperator() {
        let operator = '＿＿＿＿' //填空符
        let elInput = this.$refs['multipleType']['$el']
        let startPos = elInput.selectionStart;
        let endPos = elInput.selectionEnd;
        if (startPos === undefined || endPos === undefined) return;
        let value = elInput.value;
        let result = value.substring(0, startPos) + operator + value.substring(endPos)
        elInput.value = result;
        this.$emit('callBack', result)
        elInput.focus();
        this.$nextTick(() => {
          elInput.selectionStart = startPos + operator.length;
          elInput.selectionEnd = startPos + operator.length;
        })
      },
    },
  }
</script>

<style scoped="scoped" lang="less">
  @import url('../../../static/css/rule-setting.less');

  .multiple-box {
    textarea {
      line-height: 28px;
      font-size: 14px;
      padding-left: 0;
      padding-right: 0;
      border-top: none;
      border-left: none;
      border-right: none;
      border-color: #fff;
      resize: none;
      border-radius: 0;
    }

    textarea:hover {
      border-bottom-color: #e7e9eb;
    }

    textarea:focus {
      border-bottom-color: #1890FF;
    }
  }
</style>
