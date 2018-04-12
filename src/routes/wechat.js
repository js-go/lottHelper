const Router = require('koa-router')
const Api = require('../controller/wechat')
const { userRequire } = require('../middleware')

const wechatRouter = new Router({
  prefix: '/api/wechat'
})

wechatRouter.get('/', Api.helloWorld)
wechatRouter.get('/list', userRequire, Api.listNumbers)
wechatRouter.get('/list/:page', userRequire, Api.listNumbers)
wechatRouter.get('/uptoken', Api.uptoken)
wechatRouter.get('/userRequire', userRequire, ctx => (ctx.body = 'test'))

wechatRouter.post('/loginByWechat', Api.loginByWechat)
wechatRouter.post('/add', userRequire, Api.addNumbers)
wechatRouter.post('/ocr', Api.ocr)

module.exports = wechatRouter
