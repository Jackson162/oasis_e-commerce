const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const db = require('../../models/index')
const app = require('../../app')
const emptyDB = require('../../utils/emptyDB')
const helpers = require('../../utils/_helpers')
const { expect } = chai
const Product = db.Product
chai.use(sinonChai)

describe('#admin product features test', function () {
  context('#admin products manipulation features', function () {
    describe('#render admin multiple products page', function() {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })

        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Product.create({ name: 'water', price: 999 }),
          Product.create({ name: 'life', price: 5621 })
        )
        await Promise.all(promiseArr)
      })

      it('GET /admin/products', async function () {
        const response = await request(app)
          .get('/admin/products')
          .set('Accept', 'text/html')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
        const text = response.text
        expect(text).to.include('water')
        expect(text).to.include('$999')
        expect(text).to.include('life')
        expect(text).to.include('$5621')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })

    describe('#render admin single product page', function() {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })
        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Product.create({ id: 1, name: 'water', price: 999 }),
          Product.create({ id: 11, name: 'life', price: 5621 })
        )
        await Promise.all(promiseArr)
      })

      it('GET /admin/products/1', async function () {
        const response = await request(app)
          .get('/admin/products/1')
          .set('Accept', 'text/html')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
        const text = response.text
        expect(text).to.include('water')
        expect(text).to.include('$999')
        expect(text).not.to.include('life')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })
  })

  context('#create new products features', function () {
    describe('#render create product page', function() {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })
        await emptyDB()
      })

      it('GET /admin/products/add', async function () {
        const response = await request(app)
          .get('/admin/products/add')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-type', 'text/html; charset=utf-8')
        const text = response.text
        expect(text).to.include('name="name"')
        expect(text).to.include('name="image"')
        expect(text).to.include('name="price"')
        expect(text).to.include('name="description"')
        expect(text).to.include('action="/admin/products"')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })

    describe('#create new products', function() {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })
        await emptyDB()
      })

      it('POST /admin/products', async function () {
        await request(app)
          .post('/admin/products')
          .send('name=water&price=100&description=It is water.')
          .expect(302)
        const product = await Product.findOne({ where: { name: 'water' } })
        expect(product.price).to.equal(100)
        expect(product.description).to.equal('It is water.')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })
  })

  context('#edit products features', function () {
    describe('#render edit product page', function() {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })
        await emptyDB()
        await Product.create({ id: 1, name: 'water', price: 999, description: 'It is water' })
      })

      it('GET /admin/products/1/edit', async function () {
        const response = await request(app)
          .get('/admin/products/1/edit')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-type', 'text/html; charset=utf-8')
        const text = response.text
        expect(text).to.include('value="water"')
        expect(text).to.include('name="image"')
        expect(text).to.include('value="999"')
        expect(text).to.include('>It is water</textarea>')
        expect(text).to.include('action="/admin/products/1?_method=PUT"')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })

    describe('#edit new products', function() {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'root@example.com', role: 'admin' })
        await emptyDB()
        await Product.create({ id: 1, name: 'water', price: 999, description: 'It is water' })
      })

      it('PUT /admin/products/1', async function () {
        await request(app)
          .put('/admin/products/1')
          .send('name=life&price=300&description=It is life.')
          .expect(302)
        const product = await Product.findOne({ where: { id: 1 } })
        expect(product.name).to.equal('life')
        expect(product.price).to.equal(300)
        expect(product.description).to.equal('It is life.')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })
  })
})