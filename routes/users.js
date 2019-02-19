var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var User = require('../models/users')

//链接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/node_mongoDB',{useNewUrlParser:true});
mongoose.connection.on('open',()=>{
  console.log("mongoDB connected success")
})
mongoose.connection.on('error',()=>{
  console.log("mongoDB connected failed")
})
mongoose.connection.on('disconnected',()=>{
  console.log("mongoDB connected disconnected")
})


//用户登录
router.post('/login',(req,res,next)=>{
  let parma = {
    userName:req.body.userName,
    passWord:req.body.passWord
  }
  console.log(parma)
  User.find(parma,(err,data)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message
        })
      }else{
        if(data.length===1){
          res.json({
            status:0,
            msg:"登录成功"
         })
        }else{
          res.json({
            status:1,
            msg:"账号或用户名错误"
          })
        }
      }
  })
})


// 用户名是否存在
router.get('/isRightUserName',(req,res,next)=>{
  let param = {
    userName:req.param('userName')
  }
  User.find({userName:req.query.userName},(err,data)=>{
    if(err){
      res.json({
        status:1,
        msg:err.message
      })
    }
    else{
      console.log(data.length)
      if(data.length>=1){
        res.json({
          status:1,
          msg:"用户名已存在"
        })
      }else{
        res.json({
          status:0,
          msg:"该用户名可用"
        })
      }
    }
  })
  
})


//用户注册
router.post('/register',(req,res,next)=>{
  let parma = {
    userName:req.body.userName,
    passWord:req.body.passWord
  }
  var user = new User(parma)
  user.save((err,data)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message
        })
      }else{
        console.log(data)
        res.json({
          status:0,
          msg:"注册成功"

        })
      }
  })
})

module.exports = router;
