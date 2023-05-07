<template>
  <div class="rule-index" ref="rule-index" @click.stop="()=>{}">
    <a-modal :getContainer="() => $refs['rule-index']" centered width="520px" title="验证规则" v-bind="$attrs" v-on="$listeners"
      :maskClosable="false" @cancel="handleCancel" @ok="handleOk" cancelText="取消" okText="确定">
      <div class="rule-box">
        <div class="rule-item" style="margin-bottom: 20px;]">
          <p class="rule-info">
            <span>最多可输入：</span>
            <a-input :style="{width: '354px',borderColor:error?'red':'#d9d9d9'}" :max-length="5" @input="($event)=>{max = utils.filterValue($event,max,this)}"
              v-model="max" placeholder="请输入" />
            <span style="width: 80px;text-align: center;">个字符</span>
          </p>
        </div>
        <a-divider class="rule-divider">正则校验</a-divider>
        <div class="rule-item" v-for="(item,idx) in ruleList" :key="'ruleitem' + idx">
          <a-icon class="rule-delete" type="close" @click="delRule(idx)" />
          <p class="rule-info">
            <span>正则表达式：</span>
            <a-input v-model="item.pattern" placeholder="请输入表达式" />
          </p>
          <p class="rule-info">
            <span>错误提示语：</span>
            <a-input v-model="item.message" placeholder="请输入提示语" />
          </p>
        </div>
        <div class="add-rule-box" v-show="ruleList.length < 4">
          <div class="add-box" @click="addRule">
            <a-icon type="plus" />
            <span>添加规则</span>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import utils from '@/assets/utils/db.js'

  export default {
    props: {
      rule: {
        type: Array,
        default: () => []
      },
      max_length: [String, Number]
    },
    data() {
      return {
        utils,
        ruleList: [],
        max: null,
        error: false
      }
    },
    created() {
      this.ruleList = JSON.parse(JSON.stringify(this.rule))
      this.max = this.max_length
    },
    methods: {
      // 增加验证规则
      addRule() {
        let ruleItem = {
          pattern: '',
          message: ''
        }
        this.ruleList.push(ruleItem)
      },
      // 删除验证规则
      delRule(idx) {
        this.ruleList.splice(idx, 1)
      },
      // 取消
      handleCancel() {
        this.$emit('update:visible', false)
      },
      // 确定
      handleOk() {
        let reg = /^[+]{0,1}(\d+)$/
        if (!reg.test(this.max)) {
          this.$message.error('请输入正确的数字')
          this.error = true
          return false
        }
        let arr = []
        if (this.ruleList) {
          arr = this.ruleList.filter(el => el.pattern)
          arr.forEach((item, idx) => {
            if (!item.message) {
              item.message = '格式错误，请检查重新输入'
            }
          })
        }
        let ruleObj = {
          maxlength: this.max,
          arr
        }
        this.$emit('update:visible', false)
        this.$emit('echoRule', ruleObj)
      }
    },
  }
</script>

<style lang="less" scoped="scoped">
  .rule-item {
    position: relative;
    top: 0;
    left: 0;
    padding: 0 20px;
    margin-bottom: 30px;

    .rule-delete {
      position: absolute;
      left: 0;
      top: -10px;

      &:hover {
        color: #333333;
      }
    }

    p:last-of-type {
      margin-bottom: 0;
    }
  }

  .rule-info {
    display: flex;
    align-items: center;

    span {
      width: 134px;
      text-align: right;
    }
  }

  .add-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    margin: -5px auto 0;
    height: 32px;
    line-height: 32px;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;

    span {
      color: rgba(0, 0, 0, 0.55);
      margin-left: 5px;
    }

    &:hover {
      color: #1890FF;
      border-color: #1890FF;
      cursor: pointer;
      transition: 0.2s;

      span {
        color: #1890FF;
        transition: 0.2s;
      }
    }
  }
</style>
