/**
 * @param 常用题列表的接口
 */

'use strict';

const Service = require('egg').Service;
const utils = require('../utils/index.js');

class commonService extends Service {
	// 获取常用题列表
	async index(data) {
		// let { ctx } = this;
		let list = utils.getCommonData(data)
		return list;
	};
	
	// 增加常用题
	async add(data) {
		// let { ctx } = this;
		let param = {
			name: data.name,
			field_item: data.field_item,
			userId: data.userId
		}
		if ('id' in data) {
			param.id = data.id
		}
		await utils.addCommonItem(param)
		return;
	};
	
	// 删除常用题
	async delCommon(data) {
		utils.delCommonItem(data.id)
		return;
	};
	
	// 获取标签列表
	async getTag() {
		let list = utils.getTag()
		return list;
	}
}

module.exports = commonService;
