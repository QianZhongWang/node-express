var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/users')


//路由拦截验证登录状态
router.get('/*', function(req, res, next) {
  console.log("中间件拦截请求状态验证")
  next()
});

module.exports = router;
