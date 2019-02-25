var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/users')

const jwt = require('jsonwebtoken')



//路由拦截验证登录状态
router.get('/*', function(req, res, next) {
	if(req.path!="/users/captcha" && req.path != "/users/login" && req.path !="/users/isRightUserName" && req.paht != "/users/register"){
		let token = req.headers.authorization?req.headers.authorization:'';
		console.log(token)
		let secretOrPrivateKey = "suiyi";
		jwt.verify(token,secretOrPrivateKey,function(err,decode){
		if(err){
			res.json({
			status:401,
			
			})
		}else{
			next()
		}
		})
	}
	next()
});

module.exports = router;
