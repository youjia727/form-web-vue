<template>
  <div class="select-box">
    <div ref="wrapContent"></div>
    <div class="select-option">
      <draggable group="optionItem" handle=".optionitem-move-box" :animation="340" :list="item.options">
        <li class="optionItem" v-for="(option,optionIdx) in item.options" :key="'option' + optionIdx">
          <div class="select-option-item">
            <div class="optionitem-move-box" v-show="show">
              <img class="vertical-move" src="../../../static/image/vertical-move.png" title="移动" />
            </div>
            <img class="select-type-img" v-if="item.config.tag === 'radio'" src="../../../static/image/radio-icon.png"
              alt="单选题" />
            <img class="select-type-img" v-if="item.config.tag === 'checkbox'" src="../../../static/image/checkbox-icon.png"
              alt="多选题" />
            <span class="serial-number" v-if="item.config.tag === 'dropdown'">{{optionIdx + 1 + '.'}}</span>
            <div class="select-option-item-detail">
              <div class="item-detail-box">
                <a-textarea v-if="!option.set_other" auto-size @input="($event)=>{option.label = utils.filterValue($event,option.label,this)}"
                  v-model="option.label" :placeholder="'选项'+ (optionIdx + 1)" />
                <div class="other" v-else>
                  <span>其他</span>
                  <span class="user-submit">填写者回答区</span>
                </div>
                <div :class="['item-detail-setting',item.config.tag === 'dropdown' || option.set_other ? 'set-min-width' : '']"
                  v-show="show">
                  <a-popover placement="bottom" v-model="showUploadObj['show_' + optionIdx]" overlayClassName="popover-type-box"
                    trigger="click">
                    <span class="item-edit-img" v-if="item.config.tag !== 'dropdown' && !option.set_other">{{option.img_url?'替换图片':'添加图片'}}</span>
                    <div class="upload-select-box" slot="content">
                      <p class="upload-select-item" @click.stop="handleUploadImgUrl(optionIdx)">
                        <a-icon type="ant-cloud" style="color: #1890FF;" />
                        <span>链接图片</span>
                      </p>
                      <p class="upload-select-item" @click.stop="addOptionItemImg(optionIdx)">
                        <a-icon type="credit-card" />
                        <span>本地图片</span>
                      </p>
                    </div>
                  </a-popover>
                  <span class="item-edit-img" @click.stop="addLabel(optionIdx)">{{option.mark.length ? '编辑标签' : '添加标签'}}</span>
                  <a-icon @click.stop="deleteOptionItem(optionIdx)" type="close" />
                </div>
              </div>
              <div v-if="option.img_url && item.config.tag !== 'dropdown'" class="option-img-box">
                <img class="item-img" :src="option.img_url" />
                <div v-show="show" class="delete" @click.stop="deleteimg(optionIdx)">
                  <i class="el-icon-delete"></i>删除
                </div>
              </div>
            </div>
            <div></div>
            <div class="upload-box" style="display: none;">
              <input :ref="'optionItemUpload_option_' + optionIdx" type="file" :data-optionidx="optionIdx" :accept="accept"
                @change="handleFile" value="点击上传" />
            </div>
          </div>
          <div class="link-model" v-if="showLinkImgobj['show_' + optionIdx]">
            <img-url-input @imgLinkCallBack="handleUploadSure($event,optionIdx)" :visible.sync="showLinkImgobj['show_' + optionIdx]"></img-url-input>
          </div>
          <div class="link-model" v-if="labelShowObj['show_' + optionIdx]">
            <label-model @labelCallBack="getLabelCallBack($event,optionIdx)" :list="option.mark" :visible.sync="labelShowObj['show_' + optionIdx]"></label-model>
          </div>
          <div class="associate-box" v-if="option.jump_to.length || option.is_end">
            <span v-if="option.jump_to.length">已关联第 {{qsNumCallBack(option.jump_to)}} 题</span>
            <span v-if="option.is_end">选择此选项后，立即结束</span>
          </div>
          <div class="associate-box" v-if="option.mark.length">
            <span>{{option.mark | labelText}}</span>
          </div>
        </li>
      </draggable>
    </div>
    <div class="answer-box" v-show="item.answerData && item.answerData.length">{{item.answerData | filterAnswerStr(item.options)}}</div>
    <div class="select-option-setting" v-show="show">
      <div class="add-option-item" @click.stop="addOptionItem('ordinary')">
        <a-icon type="plus-circle" />
        <span>添加选项</span>
      </div>
      <template v-if="!item.options[item.options.length - 1].set_other">
        <span class="split-add">|</span>
        <div class="add-option-item" @click.stop="addOptionItem('other')">
          <span>添加“其他”项</span>
        </div>
      </template>
      <template v-if="setShow">
        <span class="split-add">|</span>
        <div class="add-option-item" @click.stop="setContact">
          <span>设置题目关联</span>
        </div>
      </template>
      <template v-if="item.config.tag === 'checkbox'">
        <span class="split-add">|</span>
        <div class="add-option-item" @click.stop="setCheckboxLimit">
          <span>{{strMaxMinText(item.max,item.min)}}</span>
        </div>
      </template>
      <!-- <span class="split-add">|</span>
      <div class="add-option-item" @click.stop="setAnswer(idx)">
        <span>{{item.answerData && item.answerData.length ? '编辑答案' : '设置题目答案'}}</span>
      </div> -->
    </div>

    <!-- 复选框限制选择个数的model框 -->
    <template v-if="checkLimitVisible">
      <checkbox-limit :visible.sync="checkLimitVisible" @echoCountData="setCount" :maxcount="max" :mincount="min"
        :count="checkboxCount"></checkbox-limit>
    </template>

    <!-- 关联的model框 -->
    <template v-if="associateVisible">
      <contact-item :visible.sync="associateVisible" :list="list" :active-data="item" :title="'设置题目关联'"></contact-item>
    </template>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import utils from '@/assets/utils/db.js'
  import imgUrlInput from '../imgUrlInput/index.vue'
  import labelModel from '../labelModel/index.vue'
  import contactItem from '../contact/index.vue'
  import checkboxLimit from '../checkboxLimit/index.vue'

  export default {
    components: {
      draggable,
      imgUrlInput,
      labelModel,
      contactItem,
      checkboxLimit
    },
    props: {
      item: {
        type: Object,
        default: () => {}
      },
      list: {
        type: Array,
        default: () => []
      },
      show: {
        type: Boolean,
        default: false
      },
      setShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        utils,
        showLinkImgobj: {}, //是否展示图片地址输入框
        showUploadObj: {}, //控制上传选择题文件的对象
        labelShowObj: {}, //控制标签model显示的对象
        associateVisible: false, //控制关联的model
        checkLimitVisible: false, //控制多选题选择数量的model
        checkboxCount: 2, //选项的数目
        max: 0, //当前选中的复选框最多选择
        min: 0, //当前选中状态最少选择
        accept: '.bmp,.jpg,.jpe,.jpeg,.pic,.png', //上传文件类型
      }
    },
    filters: {
      // 标签文字显示
      labelText(list) {
        let str = list.join('、')
        return '已选择「 ' + str + ' 」标签'
      },
      // 设置答案显示
      filterAnswerStr(answerArr, options) {
        let str = ''
        if (!answerArr || !answerArr.length) return str;
        answerArr.forEach(item => {
          let idx = options.findIndex(el => el.options_id == item)
          str += idx + 1 + '、'
        })
        str = str.slice(0, str.length - 1)
        return '已设置选项「 ' + str + ' 」为本题考试答案'
      }
    },
    watch: {
      'item.options': function(val, oldval) {
        val.forEach((el, idx) => {
          this.$set(this.showUploadObj, 'show_' + idx, false)
          this.$set(this.labelShowObj, 'show_' + idx, false)
        })
      }
    },
    methods: {
      //上传图片地址
      handleUploadImgUrl(optionIdx) {
        this.$set(this.showLinkImgobj, 'show_' + optionIdx, true)
        this.$set(this.showUploadObj, 'show_' + optionIdx, false)
      },
      //设置选项的图片
      addOptionItemImg(optionIndex) {
        this.$set(this.showUploadObj, 'show_' + optionIndex, false)
        this.$refs['optionItemUpload_option_' + optionIndex][0].click()
      },
      // 增加标签
      async addLabel(optionIdx) {
        let tagShow = this.$store.state.base.tagListShow
        if (!tagShow) {
          await this.$store.dispatch('base/getTagList')
        }
        this.$set(this.labelShowObj, 'show_' + optionIdx, true)
      },
      // 获取标签已设置的数据
      getLabelCallBack(labelList, optionIdx) {
        this.$set(this.item.options[optionIdx], 'mark', labelList)
      },
      //删除选择题的项
      deleteOptionItem(optionIdx) {
        let optionsLength = this.item.options.length
        if (optionsLength <= 2) {
          this.$message.info('至少设置两个选项')
          return false;
        }
        let answerArr = this.item.answerData
        let optionId = this.item.options[optionIdx].options_id
        if (answerArr.length && answerArr.includes(optionId)) {
          this.$confirm({
            title: '删除选项',
            content: '此选项已经设置为考试答案，删除后此项也将取消作为本题的答案，是否继续？',
            okText: '确定',
            okType: 'danger',
            icon: 'exclamation-circle',
            centered: true,
            cancelText: '取消',
            onOk: () => {
              let index = answerArr.findIndex(el => el == optionId)
              this.item.answerData.splice(index, 1)
              this.item.options.splice(optionIdx, 1)
              this.$message.success('删除成功')
            },
            onCancel: () => {},
          });
        } else {
          this.item.options.splice(optionIdx, 1)
        }
      },
      //上传图片
      handleFile(e) {
        let optionItemIdx = e.target.dataset.optionidx
        utils.handleFile(e, this).then(res => {
          this.$set(this.item.options[optionItemIdx], 'img_url', res)
        })
      },
      //删除图片标题
      deleteimg(optionItemIdx) {
        this.$confirm({
          title: '提示',
          content: '确认删除此图片?',
          okText: '确定',
          okType: 'danger',
          icon: 'exclamation-circle',
          centered: true,
          maskClosable: false,
          cancelText: '取消',
          getContainer: () => this.$refs.wrapContent,
          onOk: () => {
            this.$set(this.item.options[optionItemIdx], 'img_url', '')
          },
          onCancel: () => {},
        });
      },
      //上传链接图片确定
      handleUploadSure(url, optionIdx) {
        this.$set(this.item.options[optionIdx], 'img_url', url)
      },
      //增加选择题的项
      addOptionItem(type) {
        let length = this.item.options.length
        let id_arr = this.item.options.map(el => el.options_id)
        let is_set_other = this.item.options[length - 1].set_other
        let items = {
          label: '',
          mark: [],
          options_id: Math.max.apply(null, id_arr) + 1,
          img_url: '',
          jump_to: [], //关联选项
          is_end: false
        }
        if (type === 'other') {
          this.$set(items, 'set_other', true)
        }
        if (is_set_other) {
          this.item.options.splice(length - 1, 0, items)
        } else {
          this.item.options.push(items)
        }
      },
      //设置题目关联
      setContact() {
        this.associateVisible = true
      },
      // 限制多选题的最大与最小选择
      setCheckboxLimit() {
        if (this.item.config.tag === 'checkbox') {
          let items = this.item
          this.checkboxCount = items.options.length
          this.max = items.max
          this.min = items.min
          this.checkLimitVisible = true
        }
      },
      // 设置多选题选择数
      setCount(countData) {
        this.$set(this.item, 'max', countData.max)
        this.$set(this.item, 'min', countData.min)
      },
      //关联题号显示
      qsNumCallBack(arr) {
        let str = ''
        if (arr) {
          let numArr = []
          arr.forEach(el => {
            let qs_num = el.split('-')[1].split('.')[0]
            numArr.push(qs_num)
          })
          str = numArr.sort(function(a, b) {
            return a - b
          }).join('、')
        }
        return str
      },
      // 页面显示选择多选的数量
      strMaxMinText(max, min) {
        let str = ''
        if (max || min) {
          if (max && min) {
            str = '「 最多选择 ' + max + '、最少选择 ' + min + ' 」项'
          } else if (max && !min) {
            str = '「 最多选择 ' + max + ' 」项'
          } else {
            str = '「 最少选择 ' + min + ' 」项'
          }
        } else {
          str = '限制选项数量'
        }
        return str;
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  @import url('../../../static/css/rule-setting.less');
</style>
