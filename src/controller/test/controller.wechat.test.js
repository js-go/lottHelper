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
})
