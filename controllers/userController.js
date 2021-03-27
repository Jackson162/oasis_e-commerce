const bcrypt = require('bcryptjs')
const db = require('../models/index')
const User = db.User

module.exports = {
  signUpPage: async (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    const { name, email, password, passwordCheck } = req.body
     // confirm password
    if(passwordCheck !== password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      const user = await User.findOne({ where: { email: email } })
      if(user){
        req.flash('error_messages', '此信箱已被註冊！')
        return res.redirect('/signup')
      } else {
        await User.create({
          role: 'user',
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      }    
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    console.log('success_messages', '成功登入！')
    res.redirect('/products')
  }
}