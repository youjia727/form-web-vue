<template>
  <div class="form-item-box">
    <a-form-model :layout="'vertical'" v-if="drawList.length">
      <draggable group="size" handle=".mover" :animation="340" :list="drawList" @sort="listSort">
        <div :ref="'form-item' + idx" class="form-item" @click.stop="onClick(idx)" v-for="(item,idx) in drawList" :key="'item'+idx">
          <span class="mover" v-show="activeIndex===idx && show"><img src="../../../static/image/move.png" title="移动"
              alt="移动" /></span>
          <a-form-model-item :class="['item-box',activeIndex===idx?'isFocus':'']">
            <div slot="label" class="label-box">
              <span class="numIndex"><span class="required" :style="{color:item.config.required?'red':'white'}">*</span>
                {{idx + 1 + '.'}}</span>
              <a-textarea auto-size @input="($event)=>{item.config.label = utils.filterValue($event,item.config.label,this)}"
                v-model="item.config.label" placeholder="请输入问题" />
            </div>
            <div class="qs-descrble" v-if="item.showQsDescribe">
              <a-textarea auto-size @input="($event)=>{item.config.qs_describe = utils.filterValue($event,item.config.qs_describe,this)}"
                v-model="item.config.qs_describe" placeholder="题目说明" />
            </div>
            <div class="title-img-box" v-if="item.config.title_img_url">
              <img v-if="item.config.title_img_url" :src="item.config.title_img_url" alt="标题图片" />
              <div v-show="activeIndex === idx" class="delete" style="bottom: 26px;" @click.stop="deleteimg(idx)">
                <i class="el-icon-delete"></i>删除
              </div>
            </div>
            <div class="link-model">
              <img-url-input @imgLinkCallBack="handleUploadSure($event,idx)" :visible.sync="showLinkImgobj['show_' + idx]"></img-url-input>
            </div>
            <!-- 类型的组件盒子开始 -->

            <!-- 填空题 （文本类型） -->
            <div class="select-box" v-if="item.config.type === 'input'">
              <input-template :item="item" :show="activeIndex===idx" @callBack="ruleCallBack"></input-template>
            </div>
            <!-- ~~~~~~~~ -->

            <!-- 选择题 （单选，多选，下拉）-->
            <div class="select-box" v-if="item.config.type === 'select'">
              <select-template :item="item" :list="drawList" :show="activeIndex === idx"></select-template>
            </div>
            <!-- ~~~~~~~~~~~ -->

            <!-- 多段填空 -->
            <div class="select-box" v-if="item.config.type === 'multiple-input'">
              <multiple-input :item="item" :show="activeIndex===idx" @callBack="multipleInputCallBack"></multiple-input>
            </div>
            <!-- ~~~~~~~~~~~ -->

            <!-- 评分题 -->
            <div class="select-box" v-if="item.config.type === 'rate'">
              <rate-template :item="item" :show="activeIndex===idx" @callBack="rateCallBack"></rate-template>
            </div>
            <!--  -->

            <!-- 日期题 -->
            <div class="select-box" v-if="item.config.type === 'date'">
              <date-template :item="item"></date-template>
            </div>
            <!--  -->

            <!-- 省市区 -->
            <div class="select-box" v-if="item.config.type === 'area'">
              <area-template :item="item" :show="activeIndex===idx"></area-template>
            </div>
            <!--  -->

            <!-- 类型的组件盒子结束 -->

            <!-- 设置题的类型（删除，编辑题的图片，是否必填） -->
            <div class="item-config-box" v-show="activeIndex===idx">
              <div></div>
              <div class="item-config">
                <div :class="['item-type',typeCallBackShow(item.config.type)?'no-type-list':'']">
                  <span v-if="typeCallBackShow(item.config.type)">{{item.config.tag_label}}</span>
                  <a-popover v-else placement="bottom" overlayClassName="popover-type-box" v-model="visibleTypeObj['showVisible' + idx]"
                    trigger="click">
                    <div slot="content" class="popver-box">
                      <ul>
                        <li @click.stop="selectTypeTag(ele,idx)" v-for="(ele,i) in  typeArrayCallBack(item.config.type)"
                          :key="'ele' + i">
                          <a-icon :style="{display: item.config.tag.includes(ele.tag) ? 'block' : 'none'}" type="check" /><span>{{ele.text}}</span>
                        </li>
                      </ul>
                    </div>
                    <span>{{item.config.tag_label}}</span>
                    <a-icon :type="visibleTypeObj['showVisible' + idx] ? 'caret-up' : 'caret-down'" />
                  </a-popover>
                </div>
                <div style="width: 1px;height: 12px;background-color: #e2e6ed;"></div>
                <div class="require-box">
                  <span>必填</span>
                  <a-checkbox :checked="item.config.required" @change="onChange($event,idx)"></a-checkbox>
                </div>
                <span class="delete" v-show="show"><img @click.stop="editDel(idx)" src="../../../static/image/delete.png"
                    title="删除" /></span>
                <div class="more">
                  <a-popover placement="bottomLeft" overlayClassName="config-popover-type-box" v-model="configInfoObj['configVisible' + idx]"
                    trigger="click">
                    <div slot="content" class="popver-box config-popver-box">
                      <ul>
                        <li @click.stop="i === 0 ? ()=>{} : addConfigInfo(ele,idx)" v-for="(ele,i) in configOption['optionArray' + idx]"
                          v-if="!show ? i < 2 : true" :key="'element' + i">
                          <a-popover v-show="i === 0" :align="{offset: [11, -5]}" placement="rightTop" overlayClassName="popover-type-box"
                            trigger="hover">
                            <span style="display: block;">{{ele.text}}
                              <a-icon class="arrow-right" type="right" /></span>
                            <div class="upload-select-box" slot="content">
                              <p class="upload-select-item" @click.stop="handleUploadImgUrl(idx)">
                                <a-icon type="ant-cloud" style="color: #1890FF;" />
                                <span>链接图片</span>
                              </p>
                              <p class="upload-select-item" @click.stop="addConfigInfo(ele,idx)">
                                <a-icon type="credit-card" />
                                <span>本地图片</span>
                              </p>
                            </div>
                          </a-popover>
                          <span v-show="i>0">{{ele.text}}</span>
                        </li>
                      </ul>
                    </div>
                    <a-icon type="dash" />
                  </a-popover>
                </div>
                <div class="upload-box" style="display: none;">
                  <input ref="upload" type="file" :data-idx="idx" :accept="accept" @change="handleFile" value="点击上传" />
                </div>
              </div>
            </div>
            <!--   ~~~~~~~~~~~~    -->
          </a-form-model-item>
          <div ref="wrapContent"></div>
        </div>
      </draggable>
    </a-form-model>

  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import qsType from '@/assets/formConfig/tagType.js'
  import utils from '@/assets/utils/db.js'
  import bus from '@/assets/busEvent/bus.js';
  import inputTemplate from '../render/input.vue'
  import selectTemplate from '../render/select.vue'
  import multipleInput from '../render/multiple_input.vue'
  import rateTemplate from '../render/rate.vue'
  import areaTemplate from '../render/area.vue'
  import dateTemplate from '../render/date.vue'
  import imgUrlInput from '../imgUrlInput/index.vue'

  export default {
    components: {
      draggable,
      inputTemplate,
      selectTemplate,
      multipleInput,
      rateTemplate,
      areaTemplate,
      dateTemplate,
      imgUrlInput,
    },
    props: {
      list: {
        type: Array,
        default: () => []
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        utils,
        activeData: {}, //选中的数据
        activeIndex: 0, //选中的下标索引
        drawList: [], //表单列表数据
        visibleTypeObj: {}, //控制文本数据显示的对象
        configInfoObj: {}, //控制操作题目显示的对象
        textTypeList: [], //文本类型选择数组
        selectTypeList: [], //选择题类型数组
        dateTypeList: [], //日期类型选择
        configOption: {}, //更多操作对象
        showUploadObj: {}, //控制上传选择题文件的对象
        optionItemArr: qsType.configTypeArray,
        showLinkImgobj: {}, //是否展示图片地址输入框
        accept: '.bmp,.jpg,.jpe,.jpeg,.pic,.png', //上传文件类型
      }
    },
    watch: {
      //监听数组的变化
      list: {
        immediate: true,
        handler(val) {
          this.drawList = val
          this.drawList.forEach((item, idx) => {
            let arr = JSON.parse(JSON.stringify(this.optionItemArr))
            this.$set(arr[0], 'text', '添加图片（标题）')
            this.$set(arr[1], 'text', '添加题目说明')
            this.$set(this.visibleTypeObj, 'showVisible' + idx, false)
            this.$set(this.configInfoObj, 'configVisible' + idx, false)
            if (item.config.title_img_url) {
              this.$set(arr[0], 'text', '替换图片（标题）')
            }
            if (item.showQsDescribe) {
              this.$set(arr[1], 'text', '隐藏题目说明')
            }
            this.$set(this.showLinkImgobj, 'show_' + idx, false)
            this.$set(this.configOption, 'optionArray' + idx, arr)
          })
        }
      },
      'activeData.config.label': function(val, oldVal) {
        if (!this.activeData) return;
        this.updateLabel(val)
      }
    },
    created() {
      this.textTypeList = qsType.textTypeArray
      this.selectTypeList = qsType.selectTypeArray
      this.dateTypeList = qsType.dateTypeArray
      if (this.drawList) {
        this.activeData = this.drawList[this.activeIndex]
      }
    },
    methods: {
      // 验证规则回显数据
      ruleCallBack(ruleObj) {
        if (typeof(this.activeIndex) == 'number') {
          this.$set(this.drawList[this.activeIndex].config, 'regList', ruleObj.arr)
          this.$set(this.drawList[this.activeIndex].config, 'maxlength', ruleObj.maxlength)
        }
      },
      //失去选中状态传递数据
      blurActiveCallBack() {
        this.$emit('formListCallBack', this.drawList)
        this.activeIndex = null
      },
      //选择文本的类型
      selectTypeTag(item, idx) {
        let type = this.drawList[idx].config.type
        let tagName = this.drawList[idx].config.tag_label
        this.$set(this.visibleTypeObj, 'showVisible' + idx, false)
        if (tagName === item.text) return;
        if (type === 'date') {
          let tag = this.drawList[idx].config.tag
          let newTag = item.tag + '-' + tag.split('-')[1]
          this.echoTypeTag(idx, newTag, item.text)
        } else {
          let answerArr = this.drawList[idx].answerData
          if (tagName === '多选题' && answerArr.length > 1) {
            this.$confirm({
              title: '修改题目类型',
              content: '此题已设置多项考试答案，切换题型将会清除原有答案设置，是否继续?',
              okText: '确定',
              okType: 'danger',
              icon: 'exclamation-circle',
              centered: true,
              maskClosable: false,
              cancelText: '取消',
              onOk: () => {
                this.$set(this.drawList[idx], 'answerData', [])
                this.echoTypeTag(idx, item.tag, item.text)
                this.$message.success('修改成功')
              },
              onCancel: () => {},
            });
          } else {
            this.echoTypeTag(idx, item.tag, item.text)
          }
        }
      },
      // 选择类型的赋值
      echoTypeTag(idx, tag, tag_label) {
        this.$set(this.drawList[idx].config, 'tag', tag)
        this.$set(this.drawList[idx].config, 'tag_label', tag_label)
      },
      //编辑标题的信息（包括图片，描述）
      async addConfigInfo(item, idx) {
        switch (item.id) {
          case 1:
            //上传标题图片
            this.$refs.upload[idx].click()
            setTimeout(() => {
              this.$set(this.configOption['optionArray' + idx][0], 'text', '替换图片（标题）')
            }, 100)
            break;
          case 2:
            //添加题目说明
            let str = '添加'
            let bool = false
            if (!this.drawList[idx].showQsDescribe) {
              bool = true
              str = '隐藏'
            }
            this.$set(this.drawList[idx], 'showQsDescribe', bool)
            setTimeout(() => {
              this.$set(this.configOption['optionArray' + idx][1], 'text', str + '题目说明')
            }, 100)
            break;
          case 3:
            //复制题目
            let clone = JSON.parse(JSON.stringify(this.drawList[idx]))
            clone = this.$parent.$parent.createIdAndKey(clone)
            this.drawList.push(clone)
            setTimeout(() => {
              this.onClick(this.drawList.length - 1)
              this.$parent.$parent.goScrollBottom()
            }, 1)
            break;
          case 4:
            // 将此题添加为常用题
            let cloneItem = JSON.parse(JSON.stringify(this.drawList[idx]))
            if (!cloneItem.config.label) {
              this.$message.info('问题不能为空，请输入')
              return false;
            }
            let commonList = this.$store.state.base.list
            if (commonList.length && commonList.some((el, i) => {
                if (el.name == cloneItem.config.label) {
                  this.$message.info('标题已经存在')
                  return true
                }
              })) {
              return false;
            }
            let param = {
              name: cloneItem.config.label,
              field_item: JSON.stringify(cloneItem)
            }
            let res = await this.$http.fieldtemlateSave(param)
            if (res.code === 1) {
              this.$message.success('添加成功')
              this.$store.dispatch('base/getCommonUse')
            }
            break;
        }
        this.$set(this.configInfoObj, 'configVisible' + idx, false)
      },
      //删除图片标题
      deleteimg(idx, optionItemIdx) {
        this.$confirm({
          title: '提示',
          content: '确认删除此图片?',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          maskClosable: false,
          cancelText: '取消',
          getContainer: () => this.$refs.wrapContent[idx],
          onOk: () => {
            if (typeof(optionItemIdx) === 'number') {
              this.$set(this.drawList[idx].options[optionItemIdx], 'img_url', '')
            } else {
              this.$set(this.drawList[idx].config, 'title_img_url', '')
              let itemObj = this.configOption['optionArray' + idx][0]
              this.$set(itemObj, 'text', '添加图片（标题）')
            }
          },
          onCancel: () => {},
        });
      },
      //上传图片地址
      handleUploadImgUrl(idx) {
        this.showLinkImgobj['show_' + idx] = true
        this.$set(this.configInfoObj, 'configVisible' + idx, false)
      },
      //上传链接图片确定
      handleUploadSure(url, idx) {
        this.$set(this.drawList[idx].config, 'title_img_url', url)
      },
      //上传本地图片
      handleFile(e) {
        let idx = e.target.dataset.idx
        utils.handleFile(e, this).then(res => {
          this.$set(this.drawList[idx].config, 'title_img_url', res)
        })
      },
      //点击显示边框的效果
      onClick(idx) {
        this.$emit('focusForm', true)
        this.activeIndex = idx
        if (!this.drawList.length) return;
        this.activeData = this.drawList[idx]
      },
      //根据类型返回选择显示的数据数组
      typeArrayCallBack(type) {
        switch (type) {
          case 'input':
            return this.textTypeList;
            break;
          case 'select':
            return this.selectTypeList;
            break;
          case 'date':
            return this.dateTypeList;
            break;
        }
      },
      // 多段填空回显数据
      multipleInputCallBack(result) {
        let idx = this.activeIndex
        this.$set(this.drawList[idx].config, 'qs_detail', result)
      },
      // 编辑评分星数回显
      rateCallBack(count) {
        let idx = this.activeIndex
        this.$set(this.drawList[idx].config, 'count', count)
      },
      //是否必填的设置
      onChange(e, idx) {
        let bool = e.target.checked
        this.$set(this.drawList[idx].config, 'required', bool)
      },
      //删除表单
      editDel(idx) {
        let formId = this.drawList[idx].formId
        this.drawList.forEach((item, index) => {
          if (item.config.type === 'select') {
            item.options.forEach((items, optionIndex) => {
              if (items.jump_to.length) {
                items.jump_to.some((el, i) => {
                  if (el.includes(formId)) {
                    items.jump_to.splice(i, 1)
                    return true
                  }
                })
              }
            })
          }
        })
        this.drawList.splice(idx, 1)
        if (this.drawList.length && this.activeIndex === this.drawList.length) {
          this.activeIndex = this.activeIndex - 1
        }
      },
      // 根据类型显示页面数据
      typeCallBackShow(type) {
        let arr = ['rate', 'multiple-input', 'area']
        if (arr.includes(type)) {
          return true
        } else {
          return false
        }
      },
      //更新修改之后的题目
      updateLabel(val) {
        let form_id = this.activeData.formId
        this.drawList.forEach((item, index) => {
          if (item.config.type === 'select') {
            item.options.forEach((el, idx) => {
              if (el.jump_to.length) {
                el.jump_to.some((value, i) => {
                  if (value.includes(form_id)) {
                    let numstr = value.split('.')[0]
                    this.$set(this.drawList[index].options[idx].jump_to, i, numstr + '.' + val)
                    return true
                  }
                })
              }
            })
          }
        })
      },
      //表单调换顺序
      listSort(e) {
        let newIndex = e.newIndex
        this.activeIndex = newIndex
        this.drawList.forEach((item, index) => {
          if (item.config.type === 'select') {
            item.options.forEach((items, idx) => {
              if (items.jump_to.length) {
                items.jump_to.forEach((el, i) => {
                  this.drawList.some((obj, objIndex) => {
                    if (el.includes(obj.formId)) {
                      if (index > objIndex) {
                        this.drawList[index].options[idx].jump_to.splice(i, 1)
                      } else {
                        let render = obj.formId + '-' + (objIndex + 1) + '.' + obj.config.label
                        this.$set(this.drawList[index].options[idx].jump_to, i, render)
                      }
                      return true
                    }
                  })
                })
              }
            })
          }
        })
      },
    }
  }
</script>

<style scoped="scoped" lang="less">
  @import url('../../../static/css/form-item.less');
</style>
