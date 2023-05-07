<template>
  <div class="img-input" ref="img-input" @click.stop="()=>{}">
    <a-modal :destroyOnClose="true" :getContainer="() => $refs['img-input']" :maskClosable="false" okText="确定"
      cancelText="取消" centered v-bind="$attrs" v-on="$listeners" title="请将图片地址粘贴至下方" @cancel="handleCancel" @ok="handleUploadSure">
      <a-textarea :auto-size="{ minRows: 3,maxRows: 6}" v-model="img_url" @input="($event)=>{img_url = utils.filterValue($event,img_url,this)}"
        placeholder="请输入图片地址" />
    </a-modal>
  </div>
</template>

<script>
  import utils from '@/assets/utils/db.js'
  export default {
    data() {
      return {
        utils,
        img_url: ''
      }
    },
    created() {},
    methods: {
      // 确定
      handleUploadSure() {
        this.$emit('imgLinkCallBack', this.img_url)
        this.handleCancel()
      },
      // 取消
      handleCancel() {
        this.$emit('update:visible', false)
        this.img_url = ''
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  .img-input textarea {
    padding: 4px 10px;
    border: 1px solid #1890FF !important;
    resize: none;
  }
</style>
