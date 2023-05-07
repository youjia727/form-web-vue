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

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  
  //配置企业安全设置
  config.security = {
  	csrf: {
  		enable: false,
  	}
  };
  
  //配置跨域
  // config.cors = {
  // 	origin: 'http://localhost:7001', //匹配规则  域名+端口  *则为全匹配
  // 	allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  // };
  
  // 设置session
  config.session = {
    key: 'SESSION_ID',  // 设置session cookie里面的key
    maxAge: 24 * 3600 * 1000, // 设置过期时间1天
    httpOnly: true,
    encrypt: true
  };
  
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
