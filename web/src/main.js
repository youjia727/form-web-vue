// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import App from './App';
import router from './router';
import VueSocketIO from 'vue-socket.io';
import store from './store/index.js';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
// import Storage from './assets/utils/storage.js'
import SlideVerify from 'vue-monoplasty-slide-verify'; //滑动验证
import * as index from './assets/api/index.js';

import {
  Scrollbar,Main,Breadcrumb,BreadcrumbItem,Container,Divider,Pagination,Table,TableColumn,Switch,Tabs,
  TabPane,Input,Select,Option,Drawer,Button,Dialog
} from 'element-ui';

Vue.use(Vuex);
Vue.use(Scrollbar)
Vue.use(Main)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Container)
Vue.use(Divider)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Drawer)
Vue.use(Button)
Vue.use(Dialog)

Vue.use(Antd);
Vue.use(SlideVerify);

// Vue.use(new VueSocketIO({
// 	debug: true,
// 	connection: 'ws://127.0.0.1:7001',
// 	// options: {
// 	// 	path: "/verify"
// 	// }
// }))

// let storage = new Storage()

// Vue.prototype.$storage = storage;
Vue.prototype.$http = index;

Vue.config.productionTip = false

// 路由守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  // sockets: {
	 //  connect: function () {
		//   console.log('socket connected');
	 //  },
	 //  res: function (val) {
		//   console.log('接收到服务端消息', val);
	 //  }
  // },
  template: '<App/>'
})
