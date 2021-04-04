const db = require('../models/index')
const Cart = db.Cart
const CartItem = db.CartItem
const Order = db.Order
const OrderItem = db.OrderItem
const Payment = db.Payment
const Product = db.Product
const User = db.User

module.exports = async () => {
  const promiseArr = []
  promiseArr.push(
    CartItem.destroy({ truncate: true }),
    OrderItem.destroy({ truncate: true }),
    Payment.destroy({ truncate: true }),
    Order.destroy({ truncate: true }),
    Cart.destroy({ truncate: true }),
    Product.destroy({ truncate: true }),
    User.destroy({ truncate: true })
  )
  await Promise.all(promiseArr)
}