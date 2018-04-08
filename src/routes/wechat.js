const Router = require('koa-router')
const Api = require('../controller/api')
const userRequire = require('../middleware').userRequire()

const wechatRouter = new Router({
  prefix: '/api/wechat'
})

wechatRouter.get('/', Api.helloWorld)
wechatRouter.get('/list', Api.listNumbers)
wechatRouter.get('/list/:page', Api.listNumbers)

wechatRouter.post('/loginByWechat', Api.loginByWechat)
wechatRouter.post('/add', Api.addNumbers)

module.exports = wechatRouter