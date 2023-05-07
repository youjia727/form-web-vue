// const room = "default_room";

module.exports = app => {
	return async (ctx, next) => {
		const { app, socket, logger, helper } = ctx;
		const id = socket.id;
		console.log('这是auth',id)
		const nsp = app.io.of('/');
		const query = socket.handshake.query;
		// console.log('query====',query)
		// 权限校验通过
		// socket.emit('res', '权限校验成功');
		// 加入房间
		// socket.join();
		// 放行
		await next();
	}
};
