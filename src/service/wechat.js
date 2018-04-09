const crypto = require('crypto')
const request = require('request-promise')
const Op = require('sequelize').Op
const Lottery = require('../db').Lottery
const UserModel = require('../db').User
const qiniu = require('qiniu')

function getSessionKey(code) {
  const reqUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.wx_appid}&secret=${
    process.env.wx_appsecret
  }&js_code=${code}&grant_type=authorization_code`

  return request(reqUrl).then(data => {
    if (!data) {
      throw new Error('empty response')
    }

    data = JSON.parse(data)

    if (data.errcode) {
      throw new Error(data.errmsg)
    }

    return data
  })
}

function decryptData(sessionKey, encryptedData, iv, wx_appid) {
  // base64 decode
  const sessionKeyData = Buffer.from(sessionKey, 'base64')
  encryptedData = Buffer.from(encryptedData, 'base64')
  iv = Buffer.from(iv, 'base64')

  try {
    // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyData, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')

    decoded = JSON.parse(decoded)
  } catch (err) {
    throw new Error('Illegal Buffer')
  }

  if (decoded.watermark.appid !== (wx_appid || process.env.wx_appid)) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

function addNumbers(params) {
  return new Promise((resolve, reject) => {
    Lottery.create(params)
      .then(() => {
        resolve()
      })
      .catch(error => {
        // Ooops, do some error-handling
        reject(error)
      })
  })
}

function listNumbers(params) {
  return new Promise((resolve, reject) => {
    let _count, pages
    Lottery.count({
      where: {
        user_id: params.user_id
      }
    })
      .then(count => {
        pages = Math.ceil(count / params.limit)
        _count = count
        let page = params.page // page number
        let offset = params.limit * (page - 1)
        let result = Lottery.findAll({
          where: {
            user_id: params.user_id
          },
          limit: params.limit,
          offset: offset
        })
        return result
      })
      .then(result => {
        resolve({
          list: result,
          count: _count,
          pages: pages
        })
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * 通过openid查找用户信息
 *
 * @param {string} openid
 * @returns {Promise<UserModel>}
 */
function findUser(openid) {
  return UserModel.findOne({
    where: {
      openid: openid
    },
    attributes: { exclude: ['id'] }
  })
}

/**
 * 通过openid删除用户
 *
 * @param {string} openid
 */
function removeUser(openid) {
  return UserModel.destroy({
    where: {
      openid: openid
    }
  })
}

/**
 * 创建新用户
 *
 * @param {object} userInfo
 * @returns {Promise<UserModel>}
 */
function createUser(userInfo) {
  return UserModel.create({
    openid: userInfo.openId,
    name: userInfo.nickName,
    gender: userInfo.gender,
    city: userInfo.city,
    province: userInfo.province,
    avatar_url: userInfo.avatarUrl
    // address: userInfo.address
    // phone: userInfo.phone // no phone
    // unionId: userinfo.unionId
  })
}

/**
 * 更新用户信息
 *
 * @param {string} openid
 * @param {object} userInfo
 * @returns {Promise<UserModel>}
 */
function updateUserInfo(openid, userInfo) {
  return UserModel.update(userInfo, {
    where: {
      openid: {
        [Op.eq]: openid
      }
    }
  })
}

function uptoken() {
  const options = {
    scope: process.env.Bucket,
    deleteAfterDays: 7,
    returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
  }
  const mac = new qiniu.auth.digest.Mac(process.env.AccessKey, process.env.SecretKey)
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const token = putPolicy.uploadToken(mac)
  return token
}

module.exports = {
  decryptData,
  getSessionKey,
  addNumbers,
  listNumbers,
  findUser,
  createUser,
  removeUser,
  updateUserInfo,
  uptoken
}
