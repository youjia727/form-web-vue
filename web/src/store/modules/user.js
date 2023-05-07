let Base64 = require('js-base64').Base64;


export default {
  namespaced: true,//子模块必须添加命名空间
  state: {
    userInfo: {} //用户信息
  },
  mutations: {
    SET_USER(state, data) { //增加用户信息到vuex中
      state.userInfo = data;
    },
  },
  actions: {
    GET_USER_DATA(state, edit) { //用户信息函数
      
    }
  },
  getters: {}
}
