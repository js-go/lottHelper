const chai = require('chai')
const expect = chai.expect
const wechatService = require('../wechat')

var appId = 'wx4f4bc4dec97d474b'
var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
var encryptedData =
  'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZM' +
  'QmRzooG2xrDcvSnxIMXFufNstNGTyaGS' +
  '9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+' +
  '3hVbJSRgv+4lGOETKUQz6OYStslQ142d' +
  'NCuabNPGBzlooOmB231qMM85d2/fV6Ch' +
  'evvXvQP8Hkue1poOFtnEtpyxVLW1zAo6' +
  '/1Xx1COxFvrc2d7UL/lmHInNlxuacJXw' +
  'u0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn' +
  '/Hz7saL8xz+W//FRAUid1OksQaQx4CMs' +
  '8LOddcQhULW4ucetDf96JcR3g0gfRK4P' +
  'C7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB' +
  '6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns' +
  '/8wR2SiRS7MNACwTyrGvt9ts8p12PKFd' +
  'lqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYV' +
  'oKlaRv85IfVunYzO0IKXsyl7JCUjCpoG' +
  '20f0a04COwfneQAGGwd5oa+T8yO5hzuy' +
  'Db/XcxxmK01EpqOyuxINew=='
var iv = 'r7BXXKkLb8qrSNn05n0qiA=='

describe('😈 service: wechat', () => {
  beforeEach(() => {
    process.env.wx_appid = appId
  })

  it('解密微信数据 decryptData', () => {
    const decodeData = {
      openId: 'oGZUI0egBJY1zhBYw2KhdUfwVJJE',
      nickName: 'Band',
      gender: 1,
      language: 'zh_CN',
      city: 'Guangzhou',
      province: 'Guangdong',
      country: 'CN',
      avatarUrl:
        'http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0',
      unionId: 'ocMvos6NjeKLIBqg5Mr9QjxrP1FA',
      watermark: { timestamp: 1477314187, appid: 'wx4f4bc4dec97d474b' }
    }

    const decode = wechatService.decryptData(sessionKey, encryptedData, iv)

    expect(decode).to.eql(decodeData)
  })
})

describe('添加彩票号码', function() {
  describe('#add()', function() {
    it('should add without error', () => {
      const addObject = {
        periods: '1109',
        is_signle: '1',
        numbers: '01-02-03-04-05,12-13',
        name: '双色球',
        user_id: '1',
        species: '1'
      }
      return wechatService.addNumbers(addObject).then( (result) => {
        expect(result.code).to.equal(200);
      })
    });
  });


});
