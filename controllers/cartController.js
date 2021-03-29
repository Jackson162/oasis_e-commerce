const db = require('../models')
const Cart = db.Cart
const CartItem = db.CartItem
const Product = db.Product

module.exports = {
  getCart: async (req, res) => {
    let [cart, ifCartCreated] = await Cart.findOrCreate({
      where: { id: req.session.cartId || 0 },
      include: [{ model: Product, as: 'items' }]
    })
    cart = cart.toJSON()
    if(!cart.items) cart.items = []
    const totalPrice = cart.items.length > 0 ? cart.items.map(d => d.price * d.CartItem.quantity).reduce((a, b) => a + b) : 0
    req.session.cartId = cart.id
    return req.session.save(() => res.render('cart', { cart, totalPrice }))
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

  addCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({ quantity: cartItem.quantity + 1 })
    return res.redirect('back')
  },

  subCartItem: async (req, res) => {
    const cartItem = await CartItem.findByPk(req.params.id)
    await cartItem.update({
      quantity: cartItem.quantity - 1 > 0 ? cartItem.quantity - 1 : 1,
    })
    return res.redirect('back')
  },

  deleteCartItem: async (req, res) => {
  const cartItem = await CartItem.findByPk(req.params.id)
  await cartItem.destroy()
  return res.redirect('back')
  },

}