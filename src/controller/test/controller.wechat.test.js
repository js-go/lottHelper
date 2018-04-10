const { expect } = require('chai')
const request = require('supertest')
const { runDependency, server } = require('../../app')

const req = request(server)

describe('💀 controller: wechat', () => {
  describe('GET /api/wechat', () => {
    before(() => {
      return runDependency()
    })

    it('should return hello wolrd', done => {
      req
        .get('/api/wechat')
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.body.message).to.eq('hello world')

          done()
        })
    })
  })

  describe('POST /api/wechat/add', () => {
    it('should return add success info', done => {
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
          expect(err).to.be.null
          expect(res.body.message).to.eq('success')

          done()
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
          expect(err).to.be.null
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
          expect(err).to.be.null
          expect(res.body.message).to.eq('server error')
          expect(res.body.status).to.eq('fail')

          done()
        })
    })
  })

  describe('GET /api/wechat/uptoken', () => {
    it('should return a uptoken', done => {
      req
        .get('/api/wechat/uptoken')
        .expect(200)
        .expect('Cache-Control', 'max-age=0, private, must-revalidate')
        .expect('Pragma', 'no-cache')
        .expect('Expires', '0')
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res.body.message).to.eq('success')
          expect(res.body.uptoken).to.be.a('string')

          done()
        })
    })
  })

  describe('User require', function() {
    it('empty token should return 400', done => {
      req
        .get('/api/wechat/userRequire')
        .expect(400)
        .end(function(err, res) {
          expect(err).to.be.null

          done()
        })
    })

    it('error token should return 400', done => {
      req
        .get('/api/wechat/userRequire')
        .set('authorization', 'Bearer error token')
        .expect(400)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res.body.code).to.eq(400)
          expect(res.body.message).to.eq('valid fail')

          done()
        })
    })

    it('expire token should return 400', done => {
      req
        .get('/api/wechat/userRequire')
        .set(
          'authorization',
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3N1ZXIiOiJsb3R0SGVscGVyIiwiaWF0IjoxNTIzMzI3NzE3LCJleHAiOjE1MjMzMjc3MjB9.JmN3zLGiV4Zemil3tXlkNg_d0qGwZnn4IO3tzPxQfmw'
        )
        .expect(400)
        .end(function(err, res) {
          expect(err).to.be.null
          expect(res.body.code).to.eq(400)
          expect(res.body.message).to.eq('token expire')

          done()
        })
    })
  })
})
