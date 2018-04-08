const wechatService = require('../service/wechat')
const JWT = require('jsonwebtoken')
const logger = require('../log')

module.exports = {
  helloWorld: function(ctx, next) {
    ctx.body = {
      message: 'hello world'
    }
  },
  loginByWechat: function(ctx, next) {
    const { code, iv, encryptedData } = ctx.request.body

    // TODO: 使用 joi 验证 request body
    wechatService
      .getSessionKey(code)
      .then(({ openid, session_key, expires_in }) => {
        const userInfo = wechatService.decryptData(
          session_key,
          encryptedData,
          iv
        )

        if (openid !== userInfo.openId) {
          logger.info(
            'openid unequal, id-1: %s, id-2: %s',
            openid,
            userInfo.openId
          )

          throw new Error('openid unequal')
        }

        return wechatService
          .findUser(openid)
          .then(user => {
            if (!user) {
              logger.info('new user create openid %s', openid)

              return wechatService.createUser(userInfo).catch(err => {
                logger.error(err)
                throw new Error('创建用户失败')
              })
            }

            return wechatService.updateUserInfo(openid, userInfo).catch(err => {
              logger.error(err)
              throw new Error('更新用户信息失败')
            })
          })
          .then(user => {
            const signPayload = {
              uid: user.id,
              openid: user.openid,
              issuer: 'lottHelper'
            }

            return JWT.sign(signPayload, process.env.jwt_secret, {
              expiresIn: '7d'
            })
          })
      })
      .then(signToken => {
        ctx.body = {
          message: 'ok',
          data: signToken
        }
      })
      .catch(err => {
        logger.error('wechat login fail', err)

        ctx.status = 500
        ctx.body = {
          message: ''
        }
      })
  },
  addNumbers: function(ctx, next) {
    const {
      periods,
      is_signle,
      species,
      numbers,
      name,
      user_id
    } = ctx.request.body

    const addObject = {
      periods: periods,
      is_signle: is_signle,
      numbers: numbers,
      name: name,
      user_id: user_id,
      species: species
    }

    return wechatService
      .addNumbers(addObject)
      .then(result => {
        ctx.body = {
          code: 200,
          message: 'success'
        }
      })
      .catch(err => {
        ctx.body = {
          code: 500,
          message: err
        }
      })
  },
  listNumbers: function(ctx, next) {
    let limit = 5 // number of records per page
    let offset = 0
    return wechatService
      .listNumbers({
        page: ctx.params.page || 1,
        user_id: 1,
        limit,
        offset
      })
      .then(result => {
        ctx.body = {
          code: 200,
          message: 'success',
          list: result.list,
          count: result.count,
          pages: result.pages
        }
      })
      .catch(err => {
        ctx.body = {
          code: 500,
          message: err
        }
      })
  }
}
