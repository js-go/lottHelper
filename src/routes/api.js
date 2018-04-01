const Api = require('../controller/api')
const Router = require('koa-router')

const ApiRouter = new Router({
  prefix: '/api/v1'
})

ApiRouter.get('/', Api.index)

module.exports = ApiRouter
