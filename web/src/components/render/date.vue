<template>
  <div class="select-box">
    <div class="fill-info" style="margin-bottom: 1em;">
      <a-popover placement="bottomLeft" overlayClassName="popover-type-box date-select-pop" v-model="dateShow" trigger="click">
        <div slot="content" class="popver-box">
          <ul class="date-select">
            <li @click.stop="dateSelect(ele)" v-for="(ele,i) in dateSelectArr" :key="'ele' + i">
              <a-icon :style="{display: item.config.tag.includes(ele.tag) ? 'block' : 'none'}" type="check" /><span>{{ele.text}}</span>
            </li>
          </ul>
        </div>
        <span class="date-setting">
          <a-icon style="color: #1890FF;font-size: 16px;" type="schedule" />
          <a-icon class="arrow-bottom" type="caret-down" />
        </span>
      </a-popover>
      <span class="date-info">{{ dateTextCallBack(item.config.tag) }}</span>
    </div>
  </div>
</template>

<script>
  import qsType from '@/assets/formConfig/tagType.js'

  export default {
    props: {
      item: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        dateSelectArr: qsType.configTypeDate,
        dateShow: false
      }
    },
    methods: {
      // 选择日期类型
      dateSelect(items) {
        this.dateShow = false
        let tag = this.item.config.tag
        let newTag = tag.split('-')[0] + '-' + items.tag
        this.$set(this.item.config, 'tag', newTag)
      },
      //显示日期的的输入类型
      dateTextCallBack(type) {
        let tag = type.split('-')[1]
        switch (tag) {
          case 'month':
            return '年 月'
            break;
          case 'day':
            return '年 月 日'
            break;
          case 'hours':
            return '年 月 日 时 分'
            break;
        }
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  @import url('../../../static/css/rule-setting.less');
</style>
