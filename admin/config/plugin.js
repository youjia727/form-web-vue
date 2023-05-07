'use strict';

/** @type Egg.EggPlugin */

module.exports = {
	// had enabled by egg
	// static: {
	//   enable: true,
	// }
	
	// 引入数据库插件
	mysql: {
		enable: true,
		package: 'egg-mysql'
	},
	
	// 引入生成token的jwt插件
	jwt: {
		enable: true,
		package: 'egg-jwt'
	},
	
	//即时通讯
	io: {
	  enable: true,
	  package: 'egg-socket.io'
	},
	
	// 使用redis存储
	// sessionRedis: {
	// 	enable: true,
	// 	package: 'egg-session-redis'
	// },
	
	// redis: {
	// 	enable: true,
	// 	package: 'egg-redis'
	// },

	//跨域配置
	cors: {
		enable: true,
		package: 'egg-cors'
	}
};
