<template>
  <div class="index">
    <a-empty :data-source="[]" image="../../../static/image/404.png" :description="'很抱歉, 页面它不小心迷路了！！'"></a-empty>
  </div>
</template>

<script>
  export default{
    name:'Not_Found',
    data() {
      return {}
    },
    methods: {},
  }
</script>

<style scoped="scoped">
  .index{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
  }
</style>
