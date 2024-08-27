require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors =  require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cardRouter = require('./routes/cards');
var setRouter = require('./routes/sets');
const { default: mongoose } = require('mongoose');
const { ConnectDB } = require('./config/db-connfig');
const ErrorHandler = require('./utils/errorHandler');

var app = express();
const PORT = 8803
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/saudio', express.static(process.cwd() + '/saudio'))
app.use('/taudio', express.static(process.cwd() + '/taudio'))

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/v1/users', usersRouter);
app.use('/v1/cards', cardRouter);
app.use('/v1/set', setRouter);

ConnectDB()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


mongoose.connection.once("open",()=>{
  console.log(`Mongoose connected successfully!`);
  app.listen(PORT,()=> console.log(`server is running on ${PORT}`))
})

// error handler
app.use(ErrorHandler);

module.exports = app;
