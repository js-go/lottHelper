const JWT = require('jsonwebtoken')
const Joi = require('joi')
const wechatService = require('../service/wechat')
const logger = require('../log')

const loginSchema = Joi.object().keys({
  code: Joi.string().required(),
  iv: Joi.string().required(),
  encryptedData: Joi.string().required()
})

const addNumbersSchema = Joi.object().keys({
  periods: Joi.string().required(),
  is_signle: Joi.string().required(),
  species: Joi.string().required(),
  numbers: Joi.string().required(),
  name: Joi.string().required(),
  cid: Joi.string().required()
})

module.exports = {
  helloWorld: function(ctx, next) {
    ctx.body = {
      message: 'hello world'
    }
  },
  loginByWechat: function(ctx, next) {
    const valid = Joi.validate(ctx.request.body, loginSchema)

    if (valid.error) {
      ctx.status = 400
      ctx.body = {
        message: 'request body error',
        status: 'fail'
      }

      return
    }

    const { code, iv, encryptedData } = valid.value

    return wechatService
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

            return wechatService
              .updateUserInfo(openid, userInfo)
              .then(() => userInfo)
              .catch(err => {
                logger.error(err)
                throw new Error('更新用户信息失败')
              })
          })
          .then(user => {
            const signPayload = {
              openid: user.openId,
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
          result: signToken
        }
      })
      .catch(err => {
        logger.error('wechat login fail: %o', err.message)

        ctx.status = 500
        ctx.body = {
          message: 'server error',
          status: 'fail'
        }
      })
  },
  addNumbers: function(ctx, next) {
    const valid = Joi.validate(ctx.request.body, addNumbersSchema)
    if (valid.error) {
      ctx.status = 400
      return ctx.body = {
        message: 'request body error',
        status: 'fail'
      }
    }
    const {
      periods,
      is_signle,
      species,
      numbers,
      name,
      cid
    } = valid.value
    const user_id = ctx.state.user.openid
    
    if (!user_id) {
      ctx.state = 401
      return ctx.body = {
        code: 401,
        message: 'User Unauthenticated'
      }
    }

    return wechatService
      .addNumbers({
        periods: periods,
        is_signle: is_signle,
        species: species,
        numbers: numbers,
        name: name,
        user_id: user_id,
        cid: cid
      })
      .then(result => {
        ctx.status = 200;
        ctx.body = {
          code: 200,
          message: 'success'
        }
      })
      .catch(err => {
        ctx.status = 500
        ctx.body = {
          code: 500,
          message: err
        }
      })
  },
  listNumbers: function(ctx, next) {
    let limit = 5 // number of records per page
    let offset = 0
    const user_id = ctx.state.user.openid
    if (!user_id) {
      ctx.status = 401
      return ctx.body = {
        code: 401,
        message: 'User Unauthenticated'
      }
    }
    return wechatService
      .listNumbers({
        page: ctx.params.page || 1,
        user_id: user_id,
        limit,
        offset
      })
      .then(result => {
        ctx.status = 200
        ctx.body = {
          code: 200,
          message: 'success',
          list: result.list,
          count: result.count,
          pages: result.pages
        }
      })
      .catch(err => {
        ctx.status = 500
        ctx.body = {
          code: 500,
          message: err
        }
      })
  },
  uptoken: function(ctx) {
    const token = wechatService.uptoken()
    ctx.set('Cache-Control', 'max-age=0, private, must-revalidate')
    ctx.set('Pragma', 'no-cache')
    ctx.set('Expires', 0)
    if (token) {
      ctx.status = 200
      return (ctx.body = {
        code: 200,
        message: 'success',
        uptoken: token
      })
    }
    ctx.status = 500
    return (ctx.body = {
      code: 500,
      message: 'failed'
    })
  },
  ocr: function (ctx) {
    const { url } = ctx.request.body
    return wechatService.ocr(url).then((result) => {
      result = JSON.stringify(result.words_result)
      if (/福彩|体育彩?/.test(result)) {
        ctx.state = 200
        ctx.body = {
          list: result
        }
      } else {
        ctx.status = 400
        ctx.body = {
          code: 400,
          message: '这不是彩票'
        }
      }
    })
    .catch( e => {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: 'failed'
      }
      console.log(e)
    })
  }
}
