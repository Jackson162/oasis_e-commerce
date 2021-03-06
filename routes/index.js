const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const productController = require('../controllers/productController.js')
const cartController = require('../controllers/cartController.js')
const orderController = require('../controllers/orderController.js')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

const passport = require('../config/passport')
const { checkIfUser, checkIfAdmin } = require('../utils/authenticators')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => res.status(200).redirect('/products'))

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)

router.get('/cart', cartController.getCart)
router.post('/cart', cartController.postCart)
router.post('/cartItem/:id/add', cartController.addCartItem)
router.post('/cartItem/:id/sub',cartController.subCartItem)
router.delete('/cartItem/:id', cartController.deleteCartItem)

router.get('/orders', checkIfUser, orderController.getOrders)
router.post('/order', checkIfUser, orderController.postOrder)
router.post('/order/:id/cancel', checkIfUser, orderController.cancelOrder)

router.get('/order/:id/payment', checkIfUser, orderController.getPayment)
router.post('/spgateway/callback', orderController.spgatewayCallback)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.post('/signout', checkIfUser, userController.signOut)

// admin
router.get('/admin/signin', adminController.signInPage)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

router.get('/admin/users', checkIfAdmin, adminController.getUsers)
router.get('/admin/users/:userId/orders', checkIfAdmin, adminController.getOrders)
router.get('/admin/products', checkIfAdmin, adminController.getProducts)

router.get('/admin/products/add', checkIfAdmin, adminController.getAddProductPage)
router.get('/admin/products/:id/edit', checkIfAdmin, adminController.getEditProductPage)
router.get('/admin/products/:id', checkIfAdmin, adminController.getProduct)

router.post('/admin/products', checkIfAdmin, upload.single('image'), adminController.postProduct)
router.put('/admin/products/:id',  checkIfAdmin, upload.single('image'), adminController.editProduct)
router.post('/admin/signout', checkIfAdmin, adminController.signOut)

module.exports = router