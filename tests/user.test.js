const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const bcrypt = require('bcryptjs')
const db = require('../models/index')
const app = require('../app')
const { expect } = chai
const emptyDB = require('../utils/emptyDB')
const User = db.User
chai.use(sinonChai)

describe('#user features test', function () {
  context('#sign up feature', function () {
    describe('#render sign up page', function () {
      before(function () {})

      it('GET /signup', function (done) {
        request(app)
          .get('/signup')
          .set('Accept', 'text/html')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err)
            expect(res.text).to.include('action="/signup"')
            done()
          })
      })

      after(function () {})
    })

    describe('#create user account', function () {
      before(async function () {
        await emptyDB()
      })

      it('POST /signup', async function () {
        await request(app)
          .post('/signup')
          .send('email=user1@example.com&password=1&passwordCheck=1')
          .expect(302) //redirection
      
        let user = await User.findOne({ where: { email: 'user1@example.com' } })
        expect(user.role).to.equal('user')
        expect(user.email).to.equal('user1@example.com')
      })

      after(async function () {
        await emptyDB()
      })
    })
  })

  context('#sign in feature', function() {
    describe('#render user sign in page', function () {
      before(function () {})

      it('GET /signin', async function () {
        const response = await request(app)
          .get('/signup')
          .set('Accept', 'text/html')
          .expect(200)
        
        expect(response.text).to.include('action="/signin"')
      })

      after(function () {})
    })

    describe('#submit sign in', function () {
      before(async function () {
        await emptyDB()
        await User.create({ 
          email: 'user1@example.com', 
          password: bcrypt.hashSync('1', bcrypt.genSaltSync(10)),
          role: 'user' 
        })
      })

      it('POST /signin', async function () {
        await request(app)
          .post('/signin')
          .send('email=user1@example.com&password=1')
          .set('Accept', 'text/html')
          .expect(302)
          .expect('Location', '/products')
      })

      after(async function () {
        await emptyDB()
      })
    })

  })
})