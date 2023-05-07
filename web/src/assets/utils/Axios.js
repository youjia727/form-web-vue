import axios from 'axios';
import QS from 'qs';
import utils from "./sign.js";
import router from '../../router/index.js';
import {
  Loading,
  Message
} from 'element-ui';

let loading;
//开始动画
function startloading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0,0,0,0.8)'
  });
}
//结束动画
function endloading() {
  loading.close();
}

// 默认请求域名
let root;
if (process.env.NODE_ENV === 'development') {
  root = '/apis'
} else {
  root = process.env.VUE_BASE_API
}
// var root = process.env.VUE_BASE_API
axios.defaults.baseURL = root

//跨域是否自定携带cookies
axios.defaults.withCredentials = true;

//格式化参数
axios.defaults.transformRequest = [
  function(data) {
    data = utils.sign(data)
    data = QS.stringify(data)
    return data
  },
]
axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// http request 拦截器
axios.interceptors.request.use(config => {
    // 加载动画
    // startloading();
    let token = sessionStorage.getItem('FORM-TOKEN') || ''
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  })

// response 响应拦截器
axios.interceptors.response.use(response => {
  //结束动画
  // endloading();
  if (response.data.code !== 0) {
    Message.error(response.data.msg)
  }
  if (response.data.code === 1414) {
    router.push('/login')
    sessionStorage.removeItem('FORM-USER-LOGIN')
  }
  return response.data;
}, error => {
  // endloading();
  Message.error('页面开了一个小差，请稍后重试')
  return Promise.reject(error);
})

export default axios;
