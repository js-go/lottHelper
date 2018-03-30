const http = require('http')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const wechatRouter = require('./routes/wechat')
const apiRouter = require('./routes/api')

const app = new Koa()

app.use(bodyParser())
app.use(wechatRouter.routes())
app.use(apiRouter.routes())

module.exports = http.createServer(app.callback())
