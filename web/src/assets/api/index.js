import axios from '../utils/Axios.js'

/*
    接口地址
*/

// 登录系统
const login_api = '/api/login';

// 退出登录
const login_out = '/api/login_out';

//获取表单列表
const list = '/api/list';

// 获取回收站列表
const trash_list = '/api/trash_list';

// 回收站数据彻底删除
const trash_delete = '/api/trash_delete';

// 数据还原
const trash_reset = '/api/trash_reset';

//创建表单
const save = '/api/form_save';

//获取表单数据
const get_questionnaire = '/api/get_questionnaire'

//删除表单
const form_delete = '/api/delete';

//修改发布状态
const publish = '/api/publish';

//抽奖设置接口
const lottery_save = '/api/lottery_save';

//回显抽奖设置数据
const echo_lottery = '/api/echo_lottery';

// 获取标签的列表
const get_tag = '/api/get_tag';

// 获取常用题列表
const common_list = '/api/common_list';

// 增加常用题
const add_common_save = '/api/add_common_save';

// 删除常用题
const del_common_item = '/api/del_common_item';




/*
    接口使用的函数
*/

// 登录系统
export let login = (params) => {
  return axios.post(login_api, params);
}

// 退出登录
export let loginOut = (params) => {
  return axios.post(login_out, params);
}

//获取表单列表
export let getList = (params) => {
  return axios.post(list, params);
}

//获取回收站列表
export let getTrashList = (params) => {
  return axios.post(trash_list, params);
}

// 回收站彻底删除
export let trashDelete = (params) => {
  return axios.post(trash_delete, params);
}

// 回收站数据还原
export let trashReset = (params) => {
  return axios.post(trash_reset, params);
}

//创建表单
export let formSave = (params) => {
  return axios.post(save, params);
}

//获取表单数据
export let getformList = (params) => {
  return axios.post(get_questionnaire, params);
}

//编辑表单
export let editform = (params) => {
  return axios.post(update_questionnaire, params);
}

//删除表单
export let deleteform = (params) => {
  return axios.post(form_delete, params);
}

//修改发布状态
export let editPublish = (params) => {
  return axios.post(publish, params);
}

//提交结果
export let submit = (params) => {
  return axios.post(result, params);
}

//抽奖设置
export let lotterySave = (params) => {
  return axios.post(lottery_save, params);
}

//回显抽奖设置数据
export let echoLottery = (params) => {
  return axios.post(echo_lottery, params);
}

//获取标签
export let getTag = (params) => {
  return axios.post(get_tag, params);
}

//获取常用题的列表
export let commonList = (params) => {
  return axios.post(common_list, params);
}

//增加常用题
export let addCommonSave = (params) => {
  return axios.post(add_common_save, params);
}

//删除常用常用题
export let delCommonItem = (params) => {
  return axios.post(del_common_item, params);
}
