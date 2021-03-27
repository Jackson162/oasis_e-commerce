const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')
const userController = require('../controllers/userController')

const passport = require('../config/passport')
const { checkIfUser, checkIfAdmin } = require('../utils/authenticators')

/* GET home page. */
router.get('/', (req, res, next) => res.redirect('/products'))

router.get('/products', checkIfUser, productController.getProducts)

router.get('/cart', checkIfUser, cartController.getCart)
router.post('/cart', checkIfUser, cartController.postCart)
router.post('/cartItem/:id/add', checkIfUser, cartController.addCartItem)
router.post('/cartItem/:id/sub', checkIfUser, cartController.subCartItem)
router.delete('/cartItem/:id', checkIfUser, cartController.deleteCartItem)

router.get('/orders', checkIfUser, orderController.getOrders)
router.post('/order', checkIfUser, orderController.postOrder)
router.post('/order/:id/cancel', checkIfUser, orderController.cancelOrder)

router.get('/order/:id/payment', checkIfUser, orderController.getPayment)
router.post('/spgateway/callback', orderController.spgatewayCallback)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
module.exports = router