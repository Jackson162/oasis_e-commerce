const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 3
const PAGE_OFFSET = 0

module.exports = {
  getProducts: async (req, res) => {
    const products = await Product.findAndCountAll({ raw:true, nest: true, offset: PAGE_OFFSET, limit: PAGE_LIMIT })
    let cart = await Cart.findByPk(req.session.cartId, { include: 'items' })
    cart = cart ? cart.toJSON() : { items: [] }
    const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
    return res.render('products', { products, cart, totalPrice })
  },
  
}