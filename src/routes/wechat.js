const Router = require('koa-router')
const Api = require('../controller/api')

const wechatRouter = new Router({
  prefix: '/api/wechat'
})

wechatRouter.get('/', Api.helloWorld)
wechatRouter.post('/loginByWechat', Api.loginByWechat)

module.exports = wechatRouter
