<template>
  <div class="label-box" ref="label-box" @click.stop="()=>{}">
    <a-modal :destroyOnClose="true" :getContainer="() => $refs['label-box']" :maskClosable="false" okText="确定"
      cancelText="取消" dialog-class="label-class" title="请选择标签" centered v-bind="$attrs" v-on="$listeners" @cancel="handleCancel"
      @ok="handleLabelSure" width="670px">
      <div class="label-index">
        <ul class="common-label">
          <p class="item-title">
            <span>标签模板</span>
            <span v-show="customList.length" class="edit-label" @click="is_edit = !is_edit"> {{is_edit ? '完成' : '管理'}}</span>
          </p>
          <li @click="editLabel(item)" :class="[checkCallBack(item) ? 'checked' : '']" v-for="(item,idx) in listCallBack(labelList,customList)"
            :key="'labelItem' + idx">
            <span :title="item">{{item}}</span>
            <a-icon @click.stop="deleteLabel(item,idx)" v-show="idx > labelList.length - 1 && is_edit" theme="filled"
              type="minus-circle" />
          </li>
        </ul>
        <p class="add-label">
          <a-icon style="font-size: 13px;" type="plus" />
          <span @click="show = true">自定义标签</span>
        </p>
        <ul class="check-label-box" v-if="checkList.length">
          <p class="item-title">
            <span>已选中标签</span>
            <span v-show="checkList.length" class="edit-label" @click="check_edit = !check_edit"> {{check_edit ? '完成' : '管理'}}</span>
          </p>
          <li v-for="(item,idx) in checkList" :key="'checkitem' + idx">
            <span :title="item">{{item}}</span>
            <a-icon @click.stop="deleteCheckLabel(idx)" v-show="check_edit" theme="filled" type="minus-circle" />
          </li>
        </ul>

      </div>
      <a-modal :destroyOnClose="true" :getContainer="() => $refs['label-box']" :maskClosable="false" okText="确定"
        cancelText="取消" centered v-model="show" title="自定义标签" @cancel="reset" @ok="labelSure">
        <div class="add-label-form">
          <span class="title">标签名称：</span>
          <a-input placeholder="请输入" :max-length="10" @input="($event)=>{label = utils.filterValue($event,label,this)}"></a-input>
        </div>
      </a-modal>
    </a-modal>
  </div>
</template>

<script>
  import utils from '@/assets/utils/db.js'
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        utils,
        show: false,
        is_edit: false,
        check_edit: false,
        label: '',
        checkList: [], //选中的标签
        labelList: [], //服务端设置的标签
        customList: [] //自定义标签的数组
      }
    },
    watch: {
      list: {
        immediate: true,
        handler(val) {
          this.checkList = [].concat(val) //JSON.parse(JSON.stringify(this.list))
        }
      }
    },
    created() {
      this.labelList = this.$store.state.base.tagList
      this.customList = this.$store.state.base.commonTagList
    },
    methods: {
      // 选中标签的回显
      checkCallBack(item) {
        if (!this.checkList.length) {
          return false
        }
        if (!this.checkList.includes(item)) {
          return false
        }
        return true
      },
      // 选中or取消标签
      editLabel(item) {
        if (this.checkList.includes(item)) {
          this.checkList.some((items, idx) => {
            if (items === item) {
              this.checkList.splice(idx, 1)
              return true
            }
          })
        } else {
          if (this.checkList.length >= 12) {
            this.$message.info('每个选项最多添加 12 项标签')
            return false
          }
          this.checkList.push(item)
        }
      },
      // 组合数组数据
      listCallBack(arr1, arr2) {
        let arr = [].concat(arr1, arr2)
        return arr
      },
      // 删除标签
      deleteLabel(item, index) {
        this.$confirm({
          title: '删除常用标签',
          content: '删除后，已经选中的标签将会自动取消，创建表单时也无法快速进行标签选择，是否删除？',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            let idx = index - this.labelList.length
            this.customList.splice(idx, 1)
            this.checkList.some((items, i) => {
              if (items === item) {
                this.checkList.splice(i, 1)
                return true
              }
            })
            this.$store.commit('base/setCommonTag', this.customList)
            this.$message.success('删除成功')
          },
          onCancel() {},
        });
      },
      // 删除已经选中的标签
      deleteCheckLabel(idx) {
        this.$confirm({
          title: '删除选中标签',
          content: '删除后，无法获取用户答题详细标签，是否删除？',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            this.checkList.splice(idx, 1)
            this.$message.success('删除成功')
          },
          onCancel() {},
        });
      },
      // 确定
      handleLabelSure() {
        this.$emit('labelCallBack', this.checkList)
        this.handleCancel()
      },
      // 取消
      handleCancel() {
        this.$emit('update:visible', false)
        this.checkList = []
      },
      // 自定义标签确认
      labelSure() {
        let arr = [].concat(this.labelList, this.customList)
        if (arr.includes(this.label)) {
          this.$message.info('标签已存在')
          return false;
        }
        this.customList.push(this.label)
        this.$store.commit('base/setCommonTag', this.customList)
        // localStorage.setItem('djs-label-list',JSON.stringify(this.customList))
        this.$message.success('添加成功')
        this.reset()
      },
      // 自定义标签取消
      reset() {
        this.show = false
        this.label = ''
      }
    },
  }
</script>

<style lang="less" scoped="scoped">
  .edit-label {
    display: inline-block;
    margin-left: 10px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      color: #1890FF;
    }
  }

  .item-title {
    color: #000000;
    font-weight: 500;
    padding-left: 8px;
    margin-bottom: 6px;
  }

  .common-label,
  .check-label-box {
    max-height: 280px;
    padding: 4px 2px;
    box-sizing: border-box;
    overflow-y: auto;


    li {
      position: relative;
      display: inline-block;
      margin: 6px 8px;
      height: 32px;
      border: 1px solid #dedede;
      border-radius: 2px;
      text-align: center;
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        color: #1890FF;
        border-color: #1890FF;
      }

      span {
        display: inline-block;
        padding: 2px 6px;
        width: 84px;
        line-height: 26px;
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      i {
        position: absolute;
        right: -7px;
        top: -7px;
        font-size: 13px;
        color: #F20D0D;
        background-color: #fff;
        z-index: 10;
      }
    }

    .checked {
      color: #1890FF;
      border-color: #1890FF;
    }
  }

  .check-label-box {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #dedede;
  }

  .add-label {
    display: inline-block;
    width: 120px;
    line-height: 26px;
    text-align: center;
    color: #fff;
    background-color: #1890FF;
    padding: 2px 6px;
    margin: 10px 10px 0;
    border-radius: 2px;
    transition: 0.2s;
    cursor: pointer;
  }

  .add-label-form {
    display: flex;
    align-items: center;

    .title {
      width: 90px;
    }
  }
</style>
