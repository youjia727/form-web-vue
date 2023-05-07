<template>
  <div class="limit-index" ref="limit-index" @click.stop="()=>{}">
    <a-modal :getContainer="() => $refs['limit-index']" centered width="520px" title="选择数量限制" v-bind="$attrs" v-on="$listeners"
      :maskClosable="false" @cancel="handleCancel" @ok="handleOk" cancelText="取消" okText="确定">
      <div class="checkbox-limit-box">
        <div class="checkbox-limit-item">
          <span>最多选择</span>
          <a-select :getPopupContainer="() => $refs['limit-index']" v-model="max" style="width: 100px" @change="handleChangeMax">
            <a-icon slot="suffixIcon" type="caret-down" />
            <a-select-option :value="0">
              <span>不设置</span>
            </a-select-option>
            <a-select-option v-for="item in count" :key="'itemcount' + item" :value="item">
              <span>{{item}}</span>
            </a-select-option>
          </a-select>
          <span>个选项</span>
        </div>
        <div class="checkbox-limit-item">
          <span>最少选择</span>
          <a-select :getPopupContainer="() => $refs['limit-index']" v-model="min" style="width: 100px" @change="handleChangeMin">
            <a-icon slot="suffixIcon" type="caret-down" />
            <a-select-option :value="0">
              <span>不设置</span>
            </a-select-option>
            <a-select-option v-for="item in count" :key="'itemcount' + item" :value="item">
              <span>{{item}}</span>
            </a-select-option>
          </a-select>
          <span>个选项</span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    props: {
      count: {
        type: Number,
        default: 2
      },
      maxcount: {
        type: Number,
        default: 0
      },
      mincount: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        max: 0,
        min: 0
      }
    },
    created() {
      this.max = this.maxcount || 0
      this.min = this.mincount || 0
    },
    methods: {
      // 选中的count
      handleChangeMax(value) {
        if (this.min && value < this.min) {
          this.$message.error('不可小于最少选择个数')
          this.max = this.maxcount
        }
      },
      handleChangeMin(value) {
        if (this.max && value > this.max) {
          this.$message.error('不可大于最多选择个数')
          this.min = this.mincount
        }
      },
      // 取消
      handleCancel() {
        this.$emit('update:visible', false)
      },
      // 确定
      handleOk() {
        this.$emit('update:visible', false)
        let obj = {
          max: this.max,
          min: this.min
        }
        this.$emit('echoCountData', obj)
      }
    },
  }
</script>

<style lang="less" scoped="scoped">
  .checkbox-limit-item {
    margin-bottom: 20px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
</style>
