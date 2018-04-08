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
    const { periods, is_signle, species, numbers, name, user_id } = ctx.request.body
    const addObject = {
      periods: periods,
      is_signle: is_signle,
      numbers: numbers,
      name: name,
      user_id: user_id,
      species: species
    }

    return wechatService.addNumbers(addObject).then( (result) => {
      ctx.body = {
        code: 200,
        message: 'success'
      }
    })
    .catch((err)=>{
      ctx.body = {
        code: 500,
        message: err
      }
    })
    
  }
}
