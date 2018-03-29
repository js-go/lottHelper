const chai = require('chai')
const expect = chai.expect
const request = require('supertest')

const app = require('../../app')

const req = request(app)

describe('💀 routes: wechat', () => {
  describe('GET /api/wechat', () => {
    it('should return hello wolrd', done => {
      req
        .get('/api/wechat')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body.message).to.equal('hello world')
          done()
        })
    })
  })
})
