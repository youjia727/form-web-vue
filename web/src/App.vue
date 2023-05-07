<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view v-if="isRouterAlive"></router-view>
    </div>
  </a-config-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from "moment";
  import "moment/locale/zh-cn";

  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        zhCN,
        isRouterAlive: true
      }
    },
    mounted() {
      document.body.ondrop = event => {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    methods: {
      reload() { //页面重加载的方法
        this.isRouterAlive = false
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>
  @import url("../static/css/public.css");
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333;
    font-size: 14px;
    min-height: 100vh;
    min-width: 800px;
    background-color: #f7f7f7;
  }
</style>
