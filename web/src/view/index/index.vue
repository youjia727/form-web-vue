<template>
  <div class="index">
    <div class="index-content">
      <a-layout class="main">
        <a-layout-header class="header" style="height: 56px;">
          <div class="left">
            <img src="../../../static/image/logo.png" />
            <span>form-admin 表单</span>
          </div>
          <div class="login_out" @click="loginOut">退出</div>
        </a-layout-header>
        <a-layout>
          <a-layout-sider width="230" class="sider">
            <p class="add_btn" @click="$router.push('/form/form-edit')">
              <a-icon type="plus" /> 新建</p>
            <a-menu @click="onClick" :default-selected-keys="[routerCallBack($route.path)]" style="border-right: 0px;">
              <a-menu-item key="/form">
                <a-icon type="file-add" />
                <span>我创建的</span>
              </a-menu-item>
              <!-- <a-menu-item key="2">
                <a-icon type="form" />
                <span>我填写的</span>
              </a-menu-item> -->
              <!-- <a-menu-item key="3">
                <a-icon type="share-alt" />
                <span>分享给我的</span>
              </a-menu-item> -->
              <a-menu-item key="/form/trash">
                <a-icon type="delete" />
                <span>回收站</span>
              </a-menu-item>
            </a-menu>
          </a-layout-sider>
          <a-layout-content class="content">
			<keep-alive>
			  <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			  <router-view v-if="!$route.meta.keepAlive"></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {}
    },
    methods: {
	  // 激活路由
	  routerCallBack(path) {
	    let idx = this.findCharIndex(path, '/', 3)
	    let slicePath = path
	    if (idx > 0) {
	      slicePath = path.slice(0, idx)
	    }
	    return slicePath;
	  },
	  // 查找字符串第几次出现的位置
	  findCharIndex(str, char, num) {
	    var index = str.indexOf(char)
	    for (var i = 0; i < num - 1; i++) {
	      index = str.indexOf(char, index + 1)
	    }
	    return index
	  },
      // 点击菜单栏
      onClick({ item, key, keyPath }) {
		  let path = this.$route.path
		  if (key !== path && key + '/' !== path) {
			  this.$router.push(key)
		  }
      },
      // 退出登录
      loginOut() {
        this.$confirm({
          title: '提示',
          content:'确认退出登录吗？',
          okText: '确定',
          cancelText: '取消',
          centered:true,
          okType: 'danger',
          onOk:()=> {
            this.$http.loginOut({}).then(res => {
              if (res.code === 0) {
                this.$store.state.base.listShow = false
                this.$store.state.base.tagListShow = false
                this.$router.push('/login')
                this.$message.success('退出成功')
              }
            })
          },
          onCancel() {}
        })
      }
    }
  }
</script>

<style scoped="scoped" lang="less">
  .main {
    position: relative;
    min-width: 920px;
    border-left: none;
    min-height: 100vh;
    background-color: #fff;
  }

  .header,
  .sider {
    background-color: #fff;
    padding: 16px !important;
    box-sizing: border-box;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dedede;

    .left {
      display: flex;
      align-items: center;
    }

    img {
      height: 48px;
      margin-right: 10px;
      width: auto;
    }

    span {
      font-size: 20px;
    }

    .login_out {
      cursor: pointer;

      &:hover {
        color: #1890FF;
      }
    }
  }

  .sider {
    border-right: 1px solid #dedede;
  }

  .content {
    position: relative;
    padding: 20px;
    background-color: #fff;
    box-sizing: border-box;
  }

  .add_btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    border-radius: 2px;
    text-align: center;
    background-color: #1890FF;
    color: #fff;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    i {
      position: relative;
      top: 1px;
      font-size: 16px;
      font-weight: bold;
      margin-right: 6px;
    }
  }
</style>
