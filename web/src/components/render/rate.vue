<template>
  <div class="render-rate">
    <div class="select-option">
      <a-rate :count="item.config.count" disabled></a-rate>
    </div>
    <div class="select-option-setting" v-show="show">
      <div class="add-option-item" @click.stop="addStar">
        <a-icon type="plus-circle" />
        <span>添加星数</span>
      </div>
      <span class="split-add">|</span>
      <div class="add-option-item" @click.stop="delStar">
        <a-icon type="minus-circle" />
        <span>删除星数</span>
      </div>
    </div>
  </div>
</template>

<script>
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
      return {}
    },
    methods: {
      //评分题增加星数
      addStar() {
        let count = this.item.config.count
        if (count >= 20) {
          this.$message.info('提示：最多可设置20颗星')
          return false;
        }
        this.$emit('callBack', ++count)
      },
      //评分题删除星数
      delStar() {
        let count = this.item.config.count
        if (count <= 3) {
          this.$message.info('提示：最少设置3颗星')
          return false;
        }
        this.$emit('callBack', --count)
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  @import url('../../../static/css/rule-setting.less');
</style>
