const db = require('../models')
const Product = db.Product
const PAGE_LIMIT = 3;
const PAGE_OFFSET = 0;

module.exports = {
  getProducts: async (req, res) => {
    const products = await Product.findAndCountAll({ raw:true, nest: true, offset: PAGE_OFFSET, limit: PAGE_LIMIT })
      
    return res.render('products', { products })
  },
}