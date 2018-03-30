module.exports = {
  index: async function(ctx, next) {
    ctx.body = '123';
  },
  loginByWechat: async function(ctx, next) {
    // 1. 接收小程序参数 code,encryptedData,iv
    // 2. 调用 `service/wechat.js` 的，实例化wechat还需要session_key，所以取session_key
    // 3. https://api.weixin.qq.com/sns/jscode2session  params - appid, secret, code, grant_type -> session_key, openid
    // 4. 调用decryptData() 得到用户信息
    // 5. 查询openid，如果存在则为用户登录，不存在则新建用户。
    // 6. 拿到user_id，把user_id用jwt签名后，将token返回给小程序
    // 7. 每次访问api接口，验证token有效期
    // 8. token的更新: 小程序调用wx.checkSession()，如果失效重新调用wx.login()
  },
  decodeUserInfo: function(ctx, next) {
    // 解密用户信息(可能要分到另一个文件？)
  },
  
}
