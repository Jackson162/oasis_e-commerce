const authenticator = (req, res, next, role) => {
  if (!req.isAuthenticated()) return res.redirect('signin')
  if (req.user.role !== role) {
    req.flash('error_messages', `Only ${role} is authorized.`)
    if (role === 'user') return res.redirect('signin')
    // if (role === 'admin')
  }
  next()
}

module.exports = {
  checkIfAdmin: (req, res, next) => {
    return authenticator(req, res, next, 'admin')
  },

  checkIfUser: (req, res, next) => {
    return authenticator(req, res, next, 'user')
  }
}