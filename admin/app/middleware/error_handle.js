module.exports = (option, app) => {
	return async function(ctx, next) {
		try {
			await next()
		} catch (error) {
			//所有异常事件都会在app上触发error事件，框架会记录错误日志
			app.emit('error', error, this)
			const status = error.status || 500;
			//生产环境500错误详细内容不返回客户端
			const err = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : error.message;
			//从error对象中响应数据
			ctx.body = {
				code: status,
				error: err
			}
			if (status > 300 && status < 500) {
				ctx.body.detail = err.errors;
			}
			ctx.status = 200;
		}
	}
}
