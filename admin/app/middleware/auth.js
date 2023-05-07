// 中间件验证登录是否过期

const utils = require('../utils/index.js');

module.exports = (option, app) => {
	return async function(ctx, next) {
		// 获取session,验证登录是否过期
		let token = ctx.request.header.authorization;
		let secret = ctx.app.config.jwt.secret;
		let auth = ctx.session.userInfo;
		let param = ctx.request.body;
		let bool = utils.getUser().some(item => {
			if (item.id == param.userId) {
				return true
			}
		})
		if (!bool) {
			ctx.helper.notices('用户不存在！')
			return;
		}
		if (auth && token) {
			try {
				// 解码token
				let decode = ctx.app.jwt.verify(token, secret)
				if (decode.userId == param.userId) {
					await next()
				} else {
					ctx.session.userInfo = null
					ctx.helper.notices()
				}
			} catch(e) {
				//TODO handle the exception
				ctx.helper.notices()
			}
		} else {
			ctx.helper.notices()
		}
	}
}
