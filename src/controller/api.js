const wechatService = require('../service/wechat')
const JWT = require('jsonwebtoken')

module.exports = {
  helloWorld: async function (ctx, next) {
    ctx.body = {
      message: 'hello world'
    }
  },
  loginByWechat: async function (ctx, next) {
    const { code, iv, encryptedData } = ctx.request.body

    wechatService
      .getSessionKey(code)
      .then(({ openid, session_key, expires_in }) => {
        const userInfo = wechatService.decryptData(
          session_key,
          encryptedData,
          iv
        )

        // return db
        // .findUser(userInfo.openid)
        // .then(user => {
        //   if (!user) {
        //     return db.updateUser(userInfo)
        //   }
        //   return db.newUser(userInfo)
        // })
        // .then(user => {
        //   const signPayload = {
        //     uid: user.id,
        //     openid: user.openid,
        //     issuer: 'lottHelper'
        //   }

        //   return JWT.sign(signPayload, process.env.jwt_secret, {
        //     expiresIn: '7d'
        //   })
        // })
      })
      .then(signToken => {
        ctx.body = {
          message: 'ok',
          data: signToken
        }
      })
      .catch(err => {
        console.error(err)
        ctx.status = 500
        ctx.body = {
          message: ''
        }
      })

    // 1. 接收小程序参数 code,encryptedData,iv
    // 2. 调用 `service/wechat.js` 的调用decryptData()，实例化wechat还需要session_key，所以取session_key
    // 3. https://api.weixin.qq.com/sns/jscode2session  params - appid, secret, code, grant_type -> session_key, openid
    // 4. 调用decryptData() 得到用户信息
    // 5. 查询openid，如果存在则为用户登录，不存在则新建用户。
    // 6. 拿到user_id，把user_id用jwt签名后，将token返回给小程序
    // 7. 每次访问api接口，验证token有效期
    // 8. token的更新: 小程序调用wx.checkSession()，如果失效重新调用wx.login()
  }
}
