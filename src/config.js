const config = {};

config.wx = {
  appid: process.env.wx_appid || '',
  appsecret: process.env.wx_appsecret || ''
}

modules.export = config;
