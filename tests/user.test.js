const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const db = require('../models/index')
const app = require('../app')
const { expect } = chai
const User = db.User
chai.use(sinonChai)

describe('#user features test', function () {
  context('#sign up feature', function () {
    describe('GET /signup', function () {
      before(function () {})

      it('GET /signup', function (done) {
        request(app)
          .get('/signup')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.text).to.include('Password Check')
            done()
          })
      })

      after(function () {})
    })
  })

})