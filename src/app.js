const http = require('http')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const wechaRouter = require('./routes/wechat')

const app = new Koa()

app.use(bodyParser())
app.use(wechaRouter.routes())

module.exports = http.createServer(app.callback())
