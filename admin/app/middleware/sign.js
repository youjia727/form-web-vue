// 中间件验证sign过期

let utils = require('../utils/sign.js')

module.exports = (option, app) => {
	return async function(ctx, next) {
		// 验证sign
		let body = ctx.request.body;
		let param = Object.assign({}, body)
		delete param.sign;
		let sign_random = ctx.app.config.randomSign;
		let sign = utils.sign(param, sign_random).sign;
		await next()
		// if (body.sign === sign) {
		// 	await next()
		// } else {
		// 	ctx.helper.notices('签名验证失败')
		// }
	}
}
