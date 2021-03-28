const db = require('../models/index')
const User = db.User
const Order = db.Order
const Product = db.Product

module.exports = {
  signInPage: (req, res) => res.render('admin/signin'),

  signIn: (req, res) => {
    if (req.user.role !== 'admin') {
      req.flash('error_messages', 'Only admin is authorized.')
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.flash('success_messages', 'Sign in successfully.')
    return res.redirect('/admin/users')
  },

  getUsers: async (req, res) => {
    let users = await User.findAll({ where: { role: 'user' } })
    users = JSON.parse(JSON.stringify(users))
    return res.render('admin/users', { users })
  },

  getOrders: async (req, res) => {
    const { userId:UserId } = req.params
    let orders = await Order.findAll({ where: { UserId }, include: 'items' })
    orders = JSON.parse(JSON.stringify(orders))
    return res.render('admin/orders', { orders })
  },

  getProducts: async (req, res) => {
    let products = await Product.findAll()
    products = JSON.parse(JSON.stringify(products))
    return res.render('admin/products', { products })
  },

  getProduct: async (req, res) => {
    const { id } = req.params
    let product = await Product.findOne({ where: { id } })
    product = product.toJSON()
    return res.render('admin/product', { product })
  },
}