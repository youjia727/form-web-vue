'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, 欢迎您使用node-egg框架！';
  }
  
  // 登录接口
  async login() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  await service.login.index(param);
  }
  
  // 退出登录接口
  async loginOut() {
  	  const {ctx, service} = this;
  	  await service.login.loginOut()
  	  ctx.helper.message('退出登录成功！')
  }
  
  // 获取表单列表
  async getList() {
      const {ctx, service} = this;
	  let param = ctx.request.body;
      let data = await service.list.index(param);
	  let result = {
		  res: {
			  list:data.formList,
			  count: data.count
		  }
	  }
      ctx.helper.success(result)
  }
  
  // 获取回收站列表
  async getTrash() {
      const {ctx, service} = this;
  	  let param = ctx.request.body;
      let data = await service.list.getTrashData(param);
  	  let result = {
  		  res: {
  			  list:data.formList,
  			  count: data.count
  		  }
  	  }
      ctx.helper.success(result)
  }
  
  // 回收站还原
  async trashReset() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  if ('qid' in param) {
	  	  let res = await service.list.resetTrash(param);
	  	  if (res) {
	  	  	 ctx.helper.message('数据还原成功！')
	  	  } else {
	  	  	ctx.helper.error('还原数据发生错误，请稍后重试！')
	  	  }
	  } else {
	  	  ctx.helper.error('缺少参数！')
	  }
  }
  
  // 回收站彻底删除
  async trashDelete() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  if ('qid' in param) {
		  let res = await service.list.deleteTrash(param);
		  if (res) {
			  ctx.helper.message('删除成功！')
		  } else {
			  ctx.helper.error('删除数据发生错误，请稍后重试！')
		  }
	  } else {
		  ctx.helper.error('缺少参数！')
	  }
  }
  
  // 修改发布状态
  async editPublish() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  let result = await service.list.editStatus(param);
	  if (result) {
		  ctx.helper.message('修改成功！')
	  } else {
		  ctx.helper.error('缺少参数！')
	  }
  }
  
  // 创建表单与修改
  async formSave() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  delete param.time;
	  delete param.sign;
	  let res = await service.list.save(param);
	  if (res) {
		  let result = {
			  res: {
				  qid: res
			  }
		  }
		  ctx.helper.success(result)
	  } else {
		  ctx.helper.error('数据存储失败，请稍后重试！')
	  }
  }
  
  // 删除表单
  async formDelete() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  delete param.time;
	  delete param.sign;
	  if ('qid' in param) {
		  let res = await service.list.deleteForm(param);
		  if (res) {
			  ctx.helper.message('删除成功！')
		  } else {
			  ctx.helper.error('写入数据发生错误，请稍后重试！')
		  }
	  } else {
		  ctx.helper.error('缺少参数！')
	  }
  }
  
  // 获取表单详情数据
  async getQuestion() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  let detail = await service.list.getFormDetail(param)
	  if (detail) {
		let result = {
			res: detail
		  }
		  ctx.helper.success(result)
	  } else {
		  ctx.helper.error('数据获取失败，请稍后重试！')
	  }
  }
  
  // 获取标签列表接口
  async getTagList() {
	  const {ctx, service} = this;
	  let list = await service.commonList.getTag();
	  let result = {
	  	res: list
	  }
	  ctx.helper.success(result)
  }
  
  // 获取常用题列表的接口
  async getCommonList() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  let list = await service.commonList.index(param);
	  let result = {
	  	res: list
	  }
	  ctx.helper.success(result)
  }
  
  // 增加常用题
  async addCommonSave() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  await service.commonList.add(param)
	  ctx.helper.message('增加成功！')
  }
  
  // 删除常用题
  async delCommon() {
	  const {ctx, service} = this;
	  let param = ctx.request.body;
	  await service.commonList.delCommon(param)
	  ctx.helper.message('删除成功！')
  }
}

module.exports = HomeController;
