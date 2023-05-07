<template>
  <div class="common-use" ref="common-use" @click.stop="()=>{}">
    <a-modal :getContainer="() => $refs['common-use']" width="750px" :maskClosable="false" centered v-bind="$attrs"
      v-on="$listeners" :footer="null" @cancel="handleCancel">
      <span slot="title" class="title">管理常用题</span>
      <div class="common-use-body">
        <div class="add-common">
          <a-icon type="plus" />
          <span @click="initData">添加新的常用题</span>
        </div>
        <div class="common-form-item" v-if="show">
          <a-modal :getContainer="() => $refs['common-use']" width="850px" cancelText="取消" okText="确定" :maskClosable="false"
            centered v-model="show" @cancel="reset" @ok="handleSure">
            <span slot="title" class="title">添加常用题</span>
            <div class="common-select-box">
              <ul>
                <li class="select-tip">选择题型</li>
                <li @click="idx === activeIndex ? ()=>{} : checkQs(idx)" :class="[idx === activeIndex ? 'active' : '']"
                  v-for="(item,idx) in titleListComponent" :key="'item' + idx">
                  <a-icon :type="iconBack(item.config.type)" />
                  <span>{{item.config.label}}</span>
                </li>
              </ul>
              <div class="common-select-box">
                <ul style="margin-bottom: 0;">
                  <li class="select-tip">常用标题</li>
                  <a-input v-model="commonTitle" placeholder="输入自定义常用标题，不输入则为题目问题"></a-input>
                </ul>
              </div>
              <div class="common-form-body">
                <div class="form-box">
                  <form-item ref="form-item" :show="false" :list="formList"></form-item>
                </div>
              </div>
            </div>
          </a-modal>
        </div>
        <div class="common-use-list">
          <li :class="[idx + 1 === commonList.length && idx + 1 > 7 ? 'nobottom' : '']" v-for="(item,idx) in commonList" :key="'commonItem' + idx">
            <span>{{item.name}}</span>
            <div class="option">
              <span @click="editCommon(idx,item.id)">编辑</span>
              <span @click="deleteCommon(item.id)">删除</span>
            </div>
          </li>
          </ul>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import {
    titleListComponent
  } from '@/assets/formConfig/menuConfig.js'
  import {
    iconCallback
  } from '@/assets/formConfig/icon.js'
  import utils from '@/assets/utils/db.js'
  import formItem from '../formItem/index.vue'
  export default {
    components: {
      formItem
    },
    data() {
      return {
        utils,
        titleListComponent,
        formList: [],
        commonTitle: '',
        show: false,
        activeIndex: 0,
        type: 'add',
        edit_id: ''//编辑的id
      }
    },
    computed: {
      commonList:{
        get() {
          return this.$store.state.base.list
        },
        set(value) {}
      }
    },
    created() {},
    methods: {
      // 初始化数据
      initData() {
        let item = this.titleListComponent[0]
        let clone = this.createIdAndKey(item)
        this.formList.push(clone)
        this.show = true
      },
      //左侧图标筛选
      iconBack(type) {
        return iconCallback(type)
      },
      //给表单项设置唯一的标识
      createIdAndKey(item) {
        let clone = JSON.parse(JSON.stringify(item))
        let time = Date.now()
        this.$set(clone, 'formId', time)
        this.$set(clone, 'vModel', 'filed' + time)
        return clone
      },
      // 选择题型
      checkQs(idx) {
        this.activeIndex = idx
        let item = this.titleListComponent[idx]
        let clone = this.createIdAndKey(item)
        this.formList.splice(0, 1, clone)
      },
      // 编辑题型
      editCommon(idx,id) {
        this.type = 'edit'
        this.edit_id = id
        this.commonTitle = this.commonList[idx].name
        let item = this.commonList[idx].field_item
        this.formList.push(item)
        this.activeIndex = this.titleListComponent.findIndex(el => el.config.tag === item.config.tag)
        this.show = true
      },
      // 删除题型
      deleteCommon(id) {
        this.$confirm({
          title: '删除常用题',
          content: '删除后，创建表单时无法再使用该题进行快速创建，是否删除？',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          cancelText: '取消',
          onOk: () => {
            this.$http.delCommonItem({id}).then(res=>{
              if (res.code === 0) {
                this.$message.success('删除成功')
                this.$store.dispatch('base/getCommonUse')
              }
            })
          },
          onCancel() {},
        });
      },
      // 恢复默认
      reset() {
        this.show = false
        this.formList = []
        this.commonTitle = ''
        this.activeIndex = 0
        this.type = 'add'
        this.editIndex = -1
      },
      // 确定
      async handleSure() {
        let item = this.$refs['form-item'].drawList[0]
        if (!item.config.label.length) {
          this.$message.info('问题不能为空，请输入')
          return false
        }
        let param = {
          name:this.commonTitle ? this.commonTitle : item.config.label,
          field_item:JSON.stringify(item)
        }
        if (this.type === 'edit') {
          param.id = this.edit_id
        }
        let res = await this.$http.addCommonSave(param)
        if (res.code === 0) {
          this.$message.success( param.id ? '编辑成功' : '创建成功')
          this.$store.dispatch('base/getCommonUse')
          this.reset()
        }
      },
      // 取消
      handleCancel() {
        this.$emit('update:visible', false)
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  .common-use {
    .title {
      font-size: 18px;
      color: #3d4757;
      font-weight: 400;
    }

    .add-common {
      display: inline-block;
      color: #1890FF;
      margin-bottom: 24px;
      cursor: pointer;

      &:hover {
        opacity: 0.9;
      }
    }

    .common-use-list {
      height: 338px;
      border-radius: 2px;
      border: 1px solid #e2e6ed;
      overflow-y: auto;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 42px;
        padding: 0 16px;
        border-bottom: 1px solid #e2e6ed;

        >span {
          flex: 1;
          padding-right: 20px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .option {
          color: #1890FF;
          cursor: pointer;

          span {
            display: inline-block;

            &:first-of-type {
              margin-right: 10px;
            }
          }
        }
      }

      .nobottom {
        border-bottom: none;
      }
    }
  }

  .common-select-box {
    .select-tip {
      line-height: 28px;
      margin-right: 16px;
      font-weight: bolder;
    }

    ul {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;

      >input {
        flex: 1;
      }
    }

    li:not(.select-tip) {
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 86px;
      height: 28px;
      box-sizing: border-box;
      padding: 5px 10px;
      background: #fff;
      border-radius: 2px;
      border: 1px solid #e2e6ed;
      margin-right: 30px;
      font-size: 12px;
      cursor: pointer;

      &:hover {
        color: #1890FF;
        border-color: #1890FF;
        transition: 0.2s;
      }

      i {
        width: 14px;
        height: 14px;
        font-size: 14px;
        margin-right: 4px;
      }
    }

    .active {
      color: #1890FF !important;
      border-color: #1890FF !important;
    }

    .common-form-body {
      width: 100%;
      max-height: 50vh;
      margin-top: 10px;
      background: #eff1f3;
      border-radius: 2px;
      padding: 50px 20px 25px;
      overflow-y: auto;
    }
  }
</style>
