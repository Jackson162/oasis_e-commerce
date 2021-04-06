module.exports = {
  ensureAuthenticated: (req) => req.isAuthenticated(),
  getUser: (req) => req.user 
}