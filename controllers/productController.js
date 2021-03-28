const db = require('../models')
const Product = db.Product
const Cart = db.Cart
const PAGE_LIMIT = 3
const PAGE_OFFSET = 0

module.exports = {
  getProducts: async (req, res) => {
    const dataInFetching = []
    const productsPromise = Product.findAndCountAll({ raw: true, nest: true })
    const cartPromise = Cart.findByPk(req.session.cartId, { include: 'items' })
    dataInFetching.push(productsPromise, cartPromise)
    //code cannot start with '[' or '{'
    let [products, cart] = await Promise.all(dataInFetching)
    cart = cart ? cart.toJSON() : { items: [] }
    const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
    return res.render('products', { products, cart, totalPrice })
  },
  
}