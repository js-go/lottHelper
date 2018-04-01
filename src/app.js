const http = require('http')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const db = require('./db')

const wechatRouter = require('./routes/wechat')
const apiRouter = require('./routes/api')

const app = new Koa()

app.use(bodyParser())
app.use(wechatRouter.routes())
app.use(apiRouter.routes())

const server = http.createServer(app.callback())

exports.server = server

exports.runDep = function runDep () {
  return Promise.all([
    db.client.sync().catch(err => {
      if (err) {
        let error = new Error('数据库连接失败')
        error.stack = err.stack
        throw error
      }
    })
    // ...更多需要启动时完成的异步操作
  ])
}
