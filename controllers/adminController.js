const db = require('../models/index')
const User = db.User
const Order = db.Order
const Product = db.Product
const imgur = require('imgur')

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

  getAddProductPage: (req, res) => res.render('admin/add_edit'),

  postProduct: async (req, res) => {
    const { name, price, description } = req.body
    const { file } = req
    if (!name || !price || !description ) {
      req.flash('error_messages', 'Every field is required.')
      return res.redirect('/admin/products/add')
    }
    let image = null
    if (file) {
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)
      image = await imgur.uploadFile(file.path)
    }
    const product = await Product.create({
      name,
      price,
      description,
      image: image ? image.link : null
    })
    return res.redirect(`/admin/products/${product.id}`)
  },

  getEditProductPage: async (req, res) =>　{
    const { id } = req.params
    let product = await Product.findOne({ where: { id } })
    product = product.toJSON()
    return res.render('admin/add_edit', { product })
  },

  editProduct: async (req, res) => {
    const { name, price, description } = req.body
    const { file } = req
    const { id } = req.params
    if (!name || !price || !description) {
      req.flash('error_messages', 'Every field except image is required.')
      return res.redirect(`/admin/products/${id}/edit`)
    }
    let product = await Product.findOne({ where: { id } })

    let image = null
    if (file) {
      imgur.setClientId(process.env.IMGUR_CLIENT_ID)
      image = await imgur.uploadFile(file.path)
    }

    await product.update({ 
      name,
      price,
      description,
      image: image && file ? image.link : product.image
    })

    
    return res.redirect(`/admin/products/${id}`)
  },

  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    return res.redirect('/admin/signin')
  }
}