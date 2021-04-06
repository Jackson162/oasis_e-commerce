const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const bcrypt = require('bcryptjs')
const db = require('../../models/index')
const app = require('../../app')
const emptyDB = require('../../utils/emptyDB')
const helpers = require('../../utils/_helpers')
const { expect } = chai
const User = db.User
chai.use(sinonChai)

describe('#admin user features test', function () {
  context('#admin sign in feature', function() {
    describe('#render admin sign in page', function () {
      before(function () {})

      it('GET /admin/signin', async function () {
        const response = await request(app)
          .get('/admin/signin')
          .set('Accept', 'text/html')
          .expect(200)
        
        expect(response.text).to.include('action="/admin/signin"')
      })

      after(function () {})
    })

    describe('#submit sign in', function () {
      before(async function () {
        await emptyDB()
        await User.create({ 
          email: 'root@example.com', 
          password: bcrypt.hashSync('1', bcrypt.genSaltSync(10)),
          role: 'admin' 
        })
      })

      it('POST /signin', async function () {
        await request(app)
          .post('/admin/signin')
          .send('email=root@example.com&password=1')
          .expect(302)
          .expect('Location', '/admin/users')
      })

      after(async function () {
        await emptyDB()
      })
    })
  })

  context('#admin user manipulation features', function() {
    describe('#render admin users page', function () {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })
        await emptyDB()
        await User.create({ id: 11, email: 'user1@example.com', role: 'user' })
      })

      it('GET /admin/users', async function () {
        const response = await request(app)
          .get('/admin/users')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-type', 'text/html; charset=utf-8')
        const text = response.text
        expect(text).to.include('user1@example.com')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })
  })

})