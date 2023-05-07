<template>
  <div class="select-box">
    <div class="select-option">
      <div class="city-box">
        <div class="city-select-item">
          <span>省/自治区/直辖市</span>
          <a-icon class="caretdown" type="caret-down" />
        </div>
        <div class="city-select-item" v-show="areaShowCallBack(2,item.config.tag)">
          <span>市</span>
          <div v-show="item.config.tag === 'city'" class="delete-area">
            <a-icon class="caretdown" type="caret-down" />
            <div class="separator"></div>
            <a-icon class="close-city" @click="delArea(item.config.tag)" type="close" />
          </div>
          <a-icon v-show="item.config.tag !== 'city'" class="caretdown" type="caret-down" />
        </div>
        <div class="city-select-item" v-show="areaShowCallBack(3,item.config.tag)">
          <span>区/县</span>
          <div v-show="item.config.tag === 'county'" class="delete-area">
            <a-icon class="caretdown" type="caret-down" />
            <div class="separator"></div>
            <a-icon class="close-city" @click="delArea(item.config.tag)" type="close" />
          </div>
          <a-icon v-show="item.config.tag !== 'county'" class="caretdown" type="caret-down" />
        </div>
      </div>
      <p class="fill-info address" v-show="item.config.tag === 'address'">
        <span>详细地址</span>
        <span class="detail-address">
          <a-icon class="local" type="environment" />
          <div class="separator"></div>
          <a-icon class="close-city" @click="delArea(item.config.tag)" type="close" />
        </span>
      </p>
    </div>
    <div class="select-option-setting" v-show="show && item.config.tag !== 'address'">
      <div class="add-option-item" @click.stop="addArea(item.config.tag)">
        <a-icon type="plus-circle" />
        <span>{{item.config.tag | filArea}}</span>
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
    filters: {
      filArea(tag) {
        switch (tag) {
          case 'province':
            return '添加市'
            break;
          case 'city':
            return '添加区县'
            break;
          case 'county':
            return '添加详细地址'
            break;
          default:
            return '其他'
            break;
        }
      }
    },
    data() {
      return {}
    },
    methods: {
      // 区域盒子省市区显示与隐藏
      areaShowCallBack(level, tag) {
        let tagarr = ['province', 'city', 'county', 'address']
        let index = tagarr.findIndex(el => tag === el)
        return level <= index + 1
      },
      // 删除区域级别
      delArea(tag) {
        let type = ''
        switch (tag) {
          case 'city':
            type = 'province'
            break;
          case 'county':
            type = 'city'
            break;
          case 'address':
            type = 'county'
            break;
        }
        this.$set(this.item.config, 'tag', type)
      },
      // 增加区域的级别
      addArea(tag) {
        let type = ''
        switch (tag) {
          case 'province':
            type = 'city'
            break;
          case 'city':
            type = 'county'
            break;
          case 'county':
            type = 'address'
            break;
        }
        this.$set(this.item.config, 'tag', type)
      },
    },
  }
</script>

<style lang="less" scoped="scoped">
  @import url('../../../static/css/rule-setting.less');
</style>
