const db = require('../models')
const Order = db.Order

module.exports = {
  getOrders: async (req, res) => {
    let orders = await Order.findAll({ include: 'items' })
    orders = JSON.parse(JSON.stringify(orders))
    return res.render('orders', { orders })
  }
}