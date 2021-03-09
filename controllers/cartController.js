const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const PAGE_LIMIT = 10;
const PAGE_OFFSET = 0;

module.exports = {
  getCart: async (req, res) => {
    console.log(req.session)
    let cart = await Cart.findByPk(req.session.cartId, { 
      include: 'items' 
    })

    cart = cart ? cart.toJSON() : { items: [] }
    const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b)=> a + b) : 0
      
    return res.render('cart', { cart, totalPrice })
  },

  postCart: async (req, res) => {
    const [cart, ifCartCreated] = await Cart.findOrCreate({
      where: { id: req.session.cartId || 0 } //if first time of user using the cart => req.session.cartId //undefined
    })
    
    const [cartItem, ifCartItemCreated] = await CartItem.findOrCreate({
      where: {  
        CartId: cart.id,
        ProductId: req.body.productId 
      }, 
      default: {
        CartId: cart.id,
        ProductId: req.body.productId,
      }
    })

    const updatedCartItem = await cartItem.update({ 
      quantity: (cartItem.quantity || 0) + 1
    })

    req.session.cartId = cart.id
    return req.session.save(() => res.redirect('back'))
  },
}