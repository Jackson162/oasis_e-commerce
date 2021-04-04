const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const db = require('../models/index')
const app = require('../app')
const { expect } = chai
const emptyDB = require('../utils/emptyDB')
const Product = db.Product
chai.use(sinonChai)

describe('#product feature test', function () {
  context('#display products', function () {
    describe('#render multiple products page', function() {
      before(async function () {
        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Product.create({ name: 'water', price: 999 }),
          Product.create({ name: 'life', price: 5621 })
        )
        await Promise.all(promiseArr)
      })

      it('GET /products', async function () {
        const response = await request(app)
          .get('/products')
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
        await emptyDB()
      })
    })

    describe('#render single product page', function() {
      before(async function () {
        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Product.create({ id: 1, name: 'water', price: 999 }),
          Product.create({ id: 11, name: 'life', price: 5621 })
        )
        await Promise.all(promiseArr)
      })

      it('GET /products/1', async function () {
        const response = await request(app)
          .get('/products/1')
          .set('Accept', 'text/html')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
        const text = response.text
        expect(text).to.include('water')
        expect(text).to.include('$999')
        expect(text).not.to.include('life')
      })

      after(async function () {
        await emptyDB()
      })
    })
  })
})