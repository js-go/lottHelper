const JWT = require('jsonwebtoken')
const utils = require('../utils')
const wechatService = require('../service/wechat')
const logger = require('../log')

async function userRequire(ctx, next) {
  const tokenStr = utils.getToken(ctx)

  const fail = (msg = 'valid fail') => {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: msg
    }
  }

  if (!tokenStr) {
    fail()

    return
  }

  try {
    const decode = JWT.verify(tokenStr, process.env.jwt_secret)
    const findUser = await wechatService.findUser(decode.openid)

    if (!findUser) {
      fail()

      logger.info('user not found %o', decode)

      return
    }

    ctx.state.user = findUser.toJSON()
    ctx.state.jwt_token = tokenStr

    await next()
  } catch (err) {
    // https://github.com/auth0/node-jsonwebtoken#tokenexpirederror
    if (err.name === 'TokenExpiredError') {
      logger.info(err.message + ' ' + err.expiredAt)

      return fail('token expire')
    }

    logger.info('IP: %s token verify error %s', ctx.ip, err.message)

    return fail()
  }
}

module.exports = {
  userRequire
}
