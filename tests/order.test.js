const sinon = require('sinon')
const request = require('supertest')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const db = require('../models/index')
const app = require('../app')
const emptyDB = require('../utils/emptyDB')
const helpers = require('../utils/_helpers')
const { expect } = chai
const Product = db.Product
const OrderItem = db.OrderItem
const Order = db.Order
const Cart = db.Cart
const CartItem = db.CartItem
chai.use(sinonChai)

describe('order features test', function () {
  context('orders manipulation test', function () {
    describe('render orders page, cancel order', function () {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'user1@example.com', role: 'user' })

        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Order.create({ 
            id: 1, 
            sn: '12345', 
            name: 'Jackson', 
            amount: (999 / 3) * 5 + (5621 / 7) * 5,
            shipping_status: 0,
            payment_status: 0,
            UserId: 1,
            address: '243',
            phone: '0912344596'
          }),
          Product.create({ id: 1, name: 'water', price: 999 }),
          Product.create({ id: 11, name: 'life', price: 5621 })
        )
        await Promise.all(promiseArr)
        const orderItemPromiseArr = []
        orderItemPromiseArr.push(
          OrderItem.create({ id: 1, OrderId: 1, ProductId: 1, price: 999 / 3, quantity: 5 }),
          OrderItem.create({ id: 11, OrderId: 1, ProductId: 11, price: 5621 / 7, quantity: 5 })
        )
        await Promise.all(orderItemPromiseArr)
      })

      it('GET /orders', async function () {
        const response = await request(app)
          .get('/orders')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-type', 'text/html; charset=utf-8')
        const text = response.text
        expect(text).to.include('water')
        expect(text).to.include('$333')
        expect(text).to.include('life')
        expect(text).to.include('$803')
        expect(text).to.include('$5680')
        expect(text).to.include('order id: 1')
        expect(text).to.include('name: Jackson')
        expect(text).to.include('address: 243')
        expect(text).to.include('phone: 0912344596')
        expect(text).to.include('shipping_status: 0')
        expect(text).to.include('payment_status: 0')
      })

      it('POST /order/1/cacncel', async function () {
        await request(app)
          .post('/order/1/cancel')
          .expect(302)
        const order = await Order.findOne({ where: { id: 1, UserId: 1 } })
        expect(order.shipping_status).to.equal('-1')
        expect(order.payment_status).to.equal('-1')
      })

      it('GET /order/1/payment', async function () {
        const response = await request(app)
          .get('/order/1/payment')
          .set('Accept', 'text/html')
          .expect(200)
          .expect('Content-type', 'text/html; charset=utf-8')
        const order = await Order.findOne({ where: { id: 1 } })
        expect(order.sn).not.to.equal('12345')
        const text = response.text
        expect(text).to.include('name="MerchantID"')
        expect(text).to.include('name="TradeInfo"')
        expect(text).to.include('name="TradeSha"')
        expect(text).to.include('name="Version"')
      })

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })

    describe('create new order', function () {
      before(async function () {
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true)
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, email: 'user1@example.com', role: 'user' })
        await emptyDB()
        const promiseArr = []
        promiseArr.push(
          Cart.create({ id: 1 }),
          Product.create({ id: 1, name: 'water', price: 999 }),
          Product.create({ id: 11, name: 'life', price: 5621 })
        )
        await Promise.all(promiseArr)
        const cartItemPromiseArr = []
        cartItemPromiseArr.push(
          CartItem.create({ id: 1, CartId: 1, ProductId: 1, quantity: 5 }),
          CartItem.create({ id: 11, CartId: 1, ProductId: 11, quantity: 5 })
        )
        await Promise.all(cartItemPromiseArr)
      })

      it('POST /order', async function () {
        await request(app)
          .post('/order')
          .set('Accept', 'text/html')
          .send('cartId=1&name=Jackson&address=243&phone=0912344596&email=user1@example.com&shipping_status=0&payment_status=0&amount=33100')
          .expect(302)
          .expect('Location', '/orders')
        const promiseArr = []
        promiseArr.push(
          Order.findOne({ where: { UserId: 1 } }),
          OrderItem.findOne({ where: { ProductId: 1 } }),
          OrderItem.findOne({ where: { ProductId: 11 } })
        )
        const [order, water, life] = await Promise.all(promiseArr)
        expect(order.name).to.equal('Jackson')
        expect(order.address).to.equal('243')
        expect(order.phone).to.equal('0912344596')
        expect(order.amount).to.equal(33100)
        expect(water.OrderId).to.equal(order.id)
        expect(water.quantity).to.equal(5)
        expect(water.price).to.equal(999)
        expect(life.OrderId).to.equal(order.id)
        expect(life.quantity).to.equal(5)
        expect(life.price).to.equal(5621)
      })


      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })
  })
})