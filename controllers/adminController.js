const db = require('../models/index')
const User = db.User

module.exports = {
  signInPage: (req, res) => res.render('admin/signin'),

  signIn: (req, res) => {
    if (req.user.role !== 'admin') {
      req.flash('error_messages', 'Only admin is authorized.')
      req.logout()
      return res.redirect('/admin/signin')
    }
    req.flash('success_messages', 'Sign in successfully.')
    return res.redirect('/admin/users')
  },

  getUsers: async (req, res) => {
    let users = await User.findAll({ where: { role: 'user' } })
    users = JSON.parse(JSON.stringify(users))
    return res.render('admin/users', { users })
  }
}