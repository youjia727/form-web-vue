/**
 * @param 表单列表的接口
 */

'use strict';

const Service = require('egg').Service;
const utils = require('../utils/index.js');

class ListService extends Service {
	// 获取表单列表接口数据
	async index(data) {
		let list = await utils.getList(data);
		return list;
	};
	
	// 获取回收站列表数据
	async getTrashData(data) {
		let list = await utils.getTrashList(data);
		return list;
	};
	
	// 修改表单状态
	async editStatus(data) {
		let result = await utils.editStatus(data);
		return result;
	};
	
	// 表单创建保存
	async save(data) {
		let result = await utils.formSave(data)
		return result;
	};
	
	// 删除表单
	async deleteForm(data) {
		let result = await utils.formDelete(data)
		return result;
	};
	
	// 粉碎回收站数据
	async deleteTrash(data) {
		let result = await utils.trashDelete(data)
		return result;
	};
	
	// 数据还原
	async resetTrash(data) {
		let result = await utils.trashReset(data)
		return result;
	};
	
	// 获取表单详情
	async getFormDetail(data) {
		let result = await utils.getDetail(data)
		if (result) {
			delete result.isDelate;
			delete result.userId;
			result.formList = JSON.parse(result.formList)
			result.description = JSON.parse(result.description)
			result.conclusion = JSON.parse(result.conclusion)
			result.publish = JSON.parse(result.publish)
		}
		return result;
	}
}

module.exports = ListService;
