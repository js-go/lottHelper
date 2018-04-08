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
  },
  addNumbers: async function(ctx, next) {
    const { type, species, numbers } = ctx.request.body
    const addObject = {
      periods: '',
      is_signle: '',
      numbers: '',
      name: '',
      user_id: '1',
      species: species
    }
    wechatService.addNumbers(addObject).then( (res) => {
      ctx.body = {
        code: 200,
        message: 'ok'
      }
    })
    .catch(()=>{
      ctx.body = {
        code: 500,
        message: 'error'
      }
    })
    
  }
}
