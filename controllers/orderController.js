const db = require('../models')
const nodemailer = require('nodemailer')
const Order = db.Order
const OrderItem = db.OrderItem
const Cart = db.Cart
const crypto = require("crypto");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_PASS
  }
})

module.exports = {
  getOrders: async (req, res) => {
    let orders = await Order.findAll({ include: 'items' })
    orders = JSON.parse(JSON.stringify(orders))
    return res.render('orders', { orders })
  },

  postOrder: async (req, res) => {
    const { cartId, name, address, phone, email, shipping_status, payment_status, amount } = req.body
    const dataInProcessing = []
    // find the cart of the user
    let cart = Cart.findByPk(cartId, { include: 'items' })
    //create an order
    let sn = ''
    let existedOrder = ''
    do {
      sn = await crypto.randomBytes(8).toString("hex")
      console.log(sn)
      existedOrder = await Order.findOne({ where: { sn } })
    } while (existedOrder)

    
    let order = Order.create({
      name,
      sn,
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

    const mailOptions = {
      from: process.env.MY_MAIL,
      to: email,
      subject: `${order.name}，您的訂單成立`,
      text: `您的訂單成立，訂單編號: ${order.sn}，訂單ID: ${order.id}`
    }

    await Promise.all(orderItems)
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) return console.log(err)
      console.log(`Email sent to ${info.response}`)
    })
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