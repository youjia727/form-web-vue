<template>
  <div class="select-box">
    <p :class="[item.config.tag==='single-input'?'fill-info':'textarea-fill-info']">填写者回答区</p>
    <div class="select-option-setting" v-show="show">
      <div class="add-option-item" @click.stop="editRule">
        <a-icon type="plus-circle" />
        <span>{{item.config.regList.length ? '编辑规则' : '添加规则'}}</span>
      </div>
      <!-- <span class="split-add">|</span>
      <div class="add-option-item" @click.stop="answerVisible = true">
        <span>{{item.answerData && item.answerData.length ? '编辑答案' : '设置题目答案'}}</span>
      </div> -->
    </div>
    
    <!-- 文本框增加验证规则的model -->
    <template v-if="ruleModelShow">
      <rule-box :visible.sync="ruleModelShow" @echoRule="ruleCallBack" :max_length="maxLength" :rule="ruleList"></rule-box>
    </template>
    
    <!-- 设置答案的model框 -->
    <template v-if="answerVisible">
      <answer-model :visible.sync="answerVisible" @setAnswerCallBack="setAnswerCallBack" :active-data="item"></answer-model>
    </template>
  </div>
</template>

<script>
  import ruleBox from '../ruleModel/index.vue'
  import answerModel from '../setAnswer/index.vue'

  export default {
    components: {
      ruleBox,
      answerModel
    },
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
        ruleModelShow: false,
        answerVisible:false,
        ruleList: [], //当前编辑的正则数组
        maxLength: null, //最多输入字数
      }
    },
    methods: {
      // 编辑验证规则
      editRule() {
        this.ruleList = this.item.config.regList
        this.maxLength = this.item.config.maxlength
        this.ruleModelShow = true
      },
      // 验证规则回显数据
      ruleCallBack(items) {
        this.$emit('callBack', items)
      },
      // 设置答案回显
      setAnswerCallBack(val) {
        let type = val.type
        let idx = this.activeIndex
        let answer = []
        switch (type) {
          case 'select':
            if (val.tag === 'checkbox') {
              answer = val.value.sort(function(a, b) {
                return a - b
              })
            } else {
              val.value ? answer.push(val.value) : []
            }
            break;
          case 'input':
            answer = val.value ? val.value.split('#') : []
            break;
          case 'multiple-input':
            val.value.forEach((items, i) => {
              if (items.length) {
                answer[i] = items.split('#')
              } else {
                answer[i] = []
              }
            })
            let arr = answer.filter(el => el.length)
            if (!arr.length) {
              answer = []
            }
            break;
        }
        this.$set(this.item, 'answerData', answer)
      },
    },
  }
</script>

<style scoped="scoped" lang="less">
  @import url('../../../static/css/rule-setting.less');
</style>
