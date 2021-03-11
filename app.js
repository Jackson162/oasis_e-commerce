if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const PORT = process.env.PORT || 3000
const app = express()
// view engine setup
app.engine('hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'Jackson',
  cookie: { maxAge: 80000 },
  resave: false,
  saveUninitialized: true,
}))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404))
// });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

app.listen(PORT, () => {
  console.log(`This server is listening to http://localhost:${PORT}`)
})

module.exports = app;
