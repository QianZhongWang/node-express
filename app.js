var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser =require('body-parser');
var logger = require('morgan');
var ejs = require('ejs')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

// //解决跨域问题

// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Content-Type', 'application/json;charset=utf-8');
//   next();
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  secret:'12345',//表示对session数据进行加密的字符串。这个属性必须为指定属性
  name:'captcha',  //表示cookie的name
  cookie:{maxAge:60000},//cookie的过期时间
  resave:false,//是指每次请求都会重新设置 seesion cookie
  saveUninitialized:true  //是指无论有木有session cookie每次请求都会设置个seesion和cookie
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  console.log(err)
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
