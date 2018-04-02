const chai = require('chai')
const expect = chai.expect
const should = chai.should()

const request = require('supertest')
const { runDependency, server } = require('../../app')

const req = request(server)

describe('💀 routes: wechat', () => {
  describe('GET /api/wechat', () => {
    before(done => {
      runDependency().then(() => done())
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
})
