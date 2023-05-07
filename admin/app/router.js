'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt, middleware, io } = app;
  // 中间件，验证登录过期
  const auth = middleware.auth()
  const sign = middleware.sign()
  
  //在vue项目可以调用这个接口127.0.0.1:7001/data使用
  //但是会存在跨域的问题，故需要安装egg.cors的插件
  // router.post('/api/add_list',auth,controller.list.addData);
  router.get('/', controller.home.index);
  
  // socket.io
  io.of('/').route('verify', io.controller.connection.index);
  
  // 登录接口
  router.post('/api/login', sign, controller.home.login);
  
  // 退出的登录接口
  router.post('/api/login_out', sign, controller.home.loginOut);
  
  // 获取表单列表接口
  router.post('/api/list', auth, sign, controller.home.getList);
  
  // 获取回收站列表接口
  router.post('/api/trash_list', auth, sign, controller.home.getTrash);
  
  // 回收站还原接口
  router.post('/api/trash_reset', auth, sign, controller.home.trashReset);
  
  // 回收站彻底删除接口
  router.post('/api/trash_delete', auth, sign, controller.home.trashDelete);
  
  // 获取表单数据
  router.post('/api/get_questionnaire', auth, sign, controller.home.getQuestion);
  
  // 表单创建与修改
  router.post('/api/form_save', auth, sign, controller.home.formSave);
  
  // 表单删除
  router.post('/api/delete', auth, sign, controller.home.formDelete);
  
  // 修改发布状态
  router.post('/api/publish', auth, sign, controller.home.editPublish);
  
  // 获取标签列表接口
  router.post('/api/get_tag', auth, sign, controller.home.getTagList);
  
  // 获取常用题列表接口
  router.post('/api/common_list', auth, sign, controller.home.getCommonList);
  
  // 增加常用题
  router.post('/api/add_common_save', auth, sign, controller.home.addCommonSave);
  
  // 删除常用题
  router.post('/api/del_common_item', auth, sign, controller.home.delCommon);
};
