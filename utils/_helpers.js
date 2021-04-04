module.exports = {
  ensureAuthenticated: (res) => res.isAuthenticated(),
  getUser: (res) => res.user 
}