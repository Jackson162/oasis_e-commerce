const authenticator = (req, res, next, role) => {
  if (!req.isAuthenticated()) { 
    req.flash('error_messages', `Please sign in first.`)
    if (role === 'user') return res.redirect('/signin')
    if (role === 'admin') return res.redirect('/admin/signin')
  } else if (req.user.role !== role) {
    req.flash('error_messages', `Only ${role} is authorized.`)
    req.logout()
    if (role === 'user') return res.redirect('/signin')
    if (role === 'admin') return res.redirect('/admin/signin')
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