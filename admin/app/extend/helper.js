module.exports = {
	//自己定制的方法，内部直接通过this.moment()调用
	moment() {
		return '2021-03-02'
	},
	success: function({ res = null,msg = '请求成功' }) {
		//this指的是helper对象，this.ctx指context对象，this.app指application对象
		this.ctx.body = {
			code: 0,
			data: res,
			msg
		}
		this.ctx.status = 200;
	},
	message: function(msg='请求成功') {
		// console.log(this.moment())
		this.ctx.body = {
			code: 0,
			msg
		}
		this.ctx.status = 200;
	},
	error: function(msg='请求失败') {
		this.ctx.body = {
			code: 1,
			msg
		}
		this.ctx.status = 200;
	},
	notices: function(msg='登录已过期，请重新登陆') {
		this.ctx.body = {
			code: 1414,
			msg
		}
		this.ctx.status = 200;
	}
}
