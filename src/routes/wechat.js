const Router = require('koa-router')
const Api = require('../controller/wechat')
const { userRequire } = require('../middleware')

const wechatRouter = new Router({
  prefix: '/api/wechat'
})

wechatRouter.get('/', Api.helloWorld)
wechatRouter.get('/list', Api.listNumbers)
wechatRouter.get('/list/:page', Api.listNumbers)
wechatRouter.get('/uptoken', Api.uptoken)

wechatRouter.post('/loginByWechat', Api.loginByWechat)
wechatRouter.post('/add', Api.addNumbers)
wechatRouter.get('/userRequire', userRequire, ctx => (ctx.body = 'test'))

module.exports = wechatRouter
