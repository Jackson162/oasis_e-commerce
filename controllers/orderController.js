const db = require('../models')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart

module.exports = {
  getOrders: async (req, res) => {
    let orders = await Order.findAll({ include: 'items' })
    orders = JSON.parse(JSON.stringify(orders))
    return res.render('orders', { orders })
  },

  postOrder: async (req, res) => {
    const { cartId, name, address, phone, shipping_status, payment_status, amount } = req.body
    const dataInProcessing = []
    // find the cart of the user
    let cart = Cart.findByPk(cartId, { include: 'items' })
    //create an order
    let order = Order.create({
      name, 
      address, 
      phone, 
      shipping_status, 
      payment_status,
      amount //total price
    })
    dataInProcessing.push(cart, order)
    ;[cart, order] = await Promise.all(dataInProcessing)

    //add cartItem to new order => create orderItem
    const orderItems = []
    for (let i = 0; i < cart.items.length; i++) {
      console.log(order.id, cart.items[i].id)
      orderItems.push(
        OrderItem.create({
          OrderId: order.id,
          ProductId: cart.items[i].id,
          price: cart.items[i].price,
          quantity: cart.items[i].CartItem.quantity
        })
      )
    }
    await Promise.all(orderItems)
    res.redirect('/orders')
  },

  cancelOrder: async (req, res) => {
    const order = await Order.findByPk(req.params.id)
    await order.update({
      ...req.body,
      shipping_status: '-1',
      payment_status: '-1'
    })
    return res.redirect('back')
  }

}