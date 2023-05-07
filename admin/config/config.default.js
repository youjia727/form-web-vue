/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
	/**
	 * built-in config
	 * @type {Egg.EggAppConfig}
	 **/
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1634180091215_7256';

	// add your middleware config here
	// 配置需要的中间件，数组顺序即为中间件的加载顺序
	config.middleware = ['errorHandle'];

	// 数据库的配置
	// config.mysql = {
	// 	client: {
	// 		// // 主机地址 （默认：localhost）
	// 		host: 'localhost',
	// 		// 端口号（默认：3306）
	// 		port: '3306',
	// 		// 用户名
	// 		user: 'root',
	// 		// 密码
	// 		password: '123456',
	// 		// 数据库名
	// 		database: 'test',
	// 	},
	// 	// 是否加载到 app 应用程序上，默认开启
	// 	app: true,
	// 	// 是否加载到 agent 代理上，默认关闭
	// 	agent: false
	// };

	// add your user config here
	const userConfig = {
		// myAppName: 'egg',
	};
	
	//即时通讯
	config.io = {
		init: { }, // passed to engine.io
		namespace: {
			'/': {
				connectionMiddleware: ['verify'],//这里我们可以做一些权限校验之类的操作
				packetMiddleware: [],//通常用于对消息做预处理，又或者是对加密消息的解密等操作
			},
			'/captcha': {
				connectionMiddleware: [],
				packetMiddleware: [],
			}
		}
	};

	//配置企业安全设置
	config.security = {
		csrf: {
			enable: false,
		}
	};
	
	// 设置生成token的秘钥
	config.jwt = {
		secret: '123456' //自定义 token 的加密条件字符串
	};

	//配置跨域
	// config.cors = {
	// 	origin: 'http://localhost:7001', //匹配规则  域名+端口  *则为全匹配
	// 	allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
	// };

	// 设置session
	config.session = {
		key: 'SESSION_ID', // 设置session cookie里面的key
		maxAge: 24 * 3600 * 1000, // 设置过期时间1天
		httpOnly: true,
		encrypt: true,
		renew: true //延长用户登录期（当用户在线时，快到时期前半个小时，会重置 Session 的有效期）
	};
	
	// redis存储配置
	// config.redis = {
	// 	// 单个数据库用client
	// 	// client: {
	// 	// 	port: 6379,
	// 	// 	host: 'localhost',
	// 	// 	password: '',
	// 	// 	db: 0 // 单机模式的默认库
	// 	// }
	// 	// 使用多个数据库连接
	// 	clients: {
	// 		db0: {
	// 			port: 6379,
	// 			host: 'localhost',
	// 			password: '',
	// 			db: 0 // 单机模式的默认库
	// 		},
	// 		db1: {
	// 			port: 6379,
	// 			host: 'localhost',
	// 			password: '',
	// 			db: 1 // 单机模式的默认库
	// 		}
	// 	}
	// };
	
	// 设置redis存储的时间
	// sessionRedis: {
	// 	key: 'SESSION_ID', // 设置session cookie里面的key
	// 	maxAge: 24 * 3600 * 1000, // 设置过期时间1天
	// 	httpOnly: true,
	// 	encrypt: true,
	// 	renew: true //延长用户登录期（当用户在线时，快到时期前半个小时，会重置 Session 的有效期）
	// };

	//配置端口号
	// config.cluster = {
	// 	listen: {
	// 		path: '',
	// 		port: 8000,
	// 		hostname: '0.0.0.0'
	// 	}
	// };

	return {
		...config,
		...userConfig,
	};
};
