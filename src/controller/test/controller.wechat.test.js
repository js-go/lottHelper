const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const request = require('supertest')
const { runDependency, server } = require('../../app')

const req = request(server)

describe('💀 controller: wechat', () => {
  describe('GET /api/wechat', () => {
    before(done => {
      runDependency()
        .then(() => done())
        .catch(done)
    })

    it('should return hello wolrd', () => {
      req
        .get('/api/wechat')
        .expect(200)
        .end((err, res) => {
          should.not.exist(err)
          expect(res.body.message).to.eq('hello world')
        })
    })
  })

  describe('POST /api/wechat/add', () => {
    it('should return add success info', () => {
      const addObject = {
        periods: '1109',
        is_signle: '1',
        numbers: '01-02-03-04-05,12-13',
        name: '双色球',
        user_id: '1',
        species: '1'
      }

      req
        .post('/api/wechat/add')
        .send(addObject)
        .expect(200)
        .end((err, res) => {
          should.not.exist(err)
          expect(res.body.message).to.eq('success')
        })
    })
  })

  describe('POST /api/wechat/loginByWechat', () => {
    it('login post empty schema', done => {
      const loginData = {
        iv: '',
        code: '',
        encryptedData: ''
      }

      req
        .post('/api/wechat/loginByWechat')
        .send(loginData)
        .expect(400)
        .end((err, res) => {
          should.not.exist(err)

          expect(res.body.message).to.eq('request body error')
          expect(res.body.status).to.eq('fail')
          done()
        })
    })

    it('login post error schema', done => {
      const loginData = {
        iv: '1',
        code: '1',
        encryptedData: '1'
      }

      req
        .post('/api/wechat/loginByWechat')
        .send(loginData)
        .expect(500)
        .end((err, res) => {
          should.not.exist(err)

          expect(res.body.message).to.eq('server error')
          expect(res.body.status).to.eq('fail')
          done()
        })
    })
  })
})
