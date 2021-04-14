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
const OrderItem = db.OrderItem
const Order = db.Order
chai.use(sinonChai)

describe('admin order features test', function () {
  context('admin orders manipulation test', function () {
    describe('render admin orders page', function () {
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

      it('GET /admin/users/1/orders', async function () {
        const response = await request(app)
          .get('/admin/users/1/orders')
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

      after(async function () {
        this.ensureAuthenticated.restore()
        this.getUser.restore()
        await emptyDB()
      })
    })

  })
})