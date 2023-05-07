/**
 * @param 验证登录的接口
 */

'use strict';

const Service = require('egg').Service;
const utils = require('../utils/index.js');

class loginService extends Service {
	// 登录验证接口
	async index(data) {
		const { ctx, app } = this;
		let userList = utils.getUser()
		if (('username' in data) && ('password' in data)) {
			let item = userList.find(el => el.username === data.username && el.password === data.password)
			if (item) {
				// 生成token 签名
				const token = app.jwt.sign({
					userId: item.id
				}, app.config.jwt.secret, { expiresIn: 24 * 3600 })
				// 生成session，ctx.session.userInfo = null（清除session）
				// session依赖于cookie，空间小，只将必要的信息存储在 Session 中
				// 用户级别的信息存在于redis中
				ctx.session.userInfo = {
					token
				}
				let result = {
					res:{
						value: item.id,
						token
					},
					msg:'登录成功！'
				}
				ctx.helper.success(result)
				return;
			}
			let usernameArr = userList.filter(el => el.username === data.username)
			if (!usernameArr.length) {
				ctx.helper.error('未查询到该用户')
				return;
			}
			if (!usernameArr.some(el => el.password === data.password)) {
				ctx.helper.error('密码输入错误')
				return;
			}
		}
		ctx.helper.error('缺少参数')
		return;
	};
	// 退出登录接口
	async loginOut() {
		const { ctx } = this;
		ctx.session.userInfo = null
		return;
	}
}

module.exports = loginService;
