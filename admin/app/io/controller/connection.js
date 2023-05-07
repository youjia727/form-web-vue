'use strict';

const Controller = require('egg').Controller;
// const room = 'default_room';

class captchaController extends Controller {
	async index() {
		const {
			app,
			socket,
			helper,
			logger,
			args
		} = this.ctx;
		
		const message = args[0] || {};
		const id = socket.id;
		const nsp = app.io.of('/');

		try {
			// 根据id给指定连接发送消息
			// nsp.sockets[id].emit('res', "hello ....");
			nsp.emit('res', 'test')
		} catch (e) {
			//TODO handle the exception
			logger.error(e);
		}
		// // 指定房间连接信息列表
		// nsp.adapter.clients([room], (err, clients) => {
		// 	console.log(JSON.stringify(clients));
		// });
		//  给指定房间的每个人发送消息
		// app.io.of('/').to(room).emit('online', id + "上线了");
		// 断开连接
		// socket.disconnect();
	}
}
module.exports = captchaController;
