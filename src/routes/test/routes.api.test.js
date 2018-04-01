const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
const should = chai.should()

const app = require('../../app')

const req = request(app)

describe('💀 routes: api', () => {
  describe('GET /api/v1', () => {
    it('should return hello wolrd', () => {
      req
        .get('/api/v1')
        .expect(200)
        .end((err, res) => {
          should.not.exist(err)
          expect(res.body.message).to.eq('hello world')
        })
    })
  })
})
