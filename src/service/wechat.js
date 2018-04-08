const crypto = require('crypto')
const request = require('request-promise')
const Lottery = require('../db').Lottery
const User = require('../db').User
const Sequelize = require('sequelize')

async function getSessionKey(code) {
  const reqUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${
    process.env.wx_appid
  }&secret=${
    process.env.wx_appsecret
  }&js_code=${code}&grant_type=authorization_code`

  let data = await request(reqUrl)

  if (!data) {
    throw new Error('empty response')
  }

  return JSON.parse(data)
}

function decryptData(sessionKey, encryptedData, iv) {
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

  if (decoded.watermark.appid !== process.env.wx_appid) {
    throw new Error('Illegal Buffer')
  }

  return decoded
}

function addNumbers(addObject) {
  return new Promise((resolve, reject) => {
    Lottery
      .create(addObject)
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
    let _count, pages;
    Lottery.count({
        where: {
          user_id: params.user_id
        }
      }).then((count) => {
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
        return result;
      })
      .then((result) => {
        resolve({
          list: result,
          count: _count,
          pages: pages
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

module.exports = {
  decryptData,
  getSessionKey,
  addNumbers,
  listNumbers
}