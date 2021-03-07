const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

module.exports = {
  getCart: async (req, res) => {
    let cart = await Cart.findOne({include: 'items'})
    cart = cart.toJSON()
    const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b)=> a + b) : 0
      
      return res.render('cart', { cart, totalPrice })
    
  },
}