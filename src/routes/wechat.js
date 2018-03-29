const Router = require('koa-router')

const wechatRouter = new Router({
  prefix: '/api/wechat'
})

wechatRouter.get('/', async ctx => {
  ctx.body = { message: 'hello world' }
})

module.exports = wechatRouter
