const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const db = require('../models/index')
const app = require('../app')
const { expect } = chai
const emptyDB = require('../utils/emptyDB')
const Product = db.Product
const CartItem = db.CartItem
const Cart = db.Cart
chai.use(sinonChai)

describe('#cart feature test', function () {
  context('#cart manipulation features', function () {
    describe('#create cart and render cart page', function () {
      let cookies = ''
      before(async function () {
        await emptyDB()
        await Product.create({ id: 1, name: 'water', price: 999 })
      }) 

      it('POST /cart', async function() {
        const response = await request(app)
          .post('/cart')
          .send('productId=1')
          .expect(302)
        const cartItem = await CartItem.findOne({ where: { ProductId: 1 } })
        expect(cartItem.quantity).to.equal(1)
        cookies = response.headers['set-cookie'].pop().split(';')[0]
      })

      it('GET /cart', async function() {
        const req = request(app).get('/cart')
        req.cookies = cookies
        const response = await req.set('Accept', 'text/html')
          .expect('Content-type', 'text/html; charset=utf-8')
          .expect(200)
        const text = response.text
        expect(text).to.include('water')
        expect(text).to.include('$999')
      })


      after(async function () {
        await emptyDB()
      })
    })
  })

  context('#cartItem manipulation features', function () {
    describe('#add, subtract and destroy cartItem', function () {
      before(async function () {
        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Cart.create({ id: 1 }),
          Product.create({ id: 1, name: 'water', price: 999 })
        )
        await Promise.all(promiseArr)
        await CartItem.create({ id: 1, cartId: 1, productId: 1, quantity: 2 })
      })

      it('POST /cartItem/1/add', async function() {
        await request(app)
          .post('/cartItem/1/add')
          .expect(302)
        const cartItem = await CartItem.findOne({ where: { id: 1 } })
        expect(cartItem.quantity).to.equal(2 + 1)
      })

      it('POST /cartItem/1/sub', async function() {
        await request(app)
          .post('/cartItem/1/sub')
          .expect(302)
        const cartItem = await CartItem.findOne({ where: { id: 1 } })
        expect(cartItem.quantity).to.equal(3 - 1)
      })

      it('DELETE /cartItem/1', async function() {
        await request(app)
          .delete('/cartItem/1')
          .expect(302)
        const cartItem = await CartItem.findOne({ where: { id: 1 } })
        expect(cartItem).to.equal(null)
      })

      after(async function () {
        await emptyDB()
      })
    })
  })

})