const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/users')
const svgCaptcha = require('svg-captcha')
const jwt = require('jsonwebtoken')

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


router.get('/captcha',(req,res,next)=>{
    const cap = svgCaptcha.create({
		//翻转颜色
		inverse:false,
		//字体大小
		fontSize:40,
		//噪音线数
		noise:2,
		//宽度
		width:80,
		height:40,
	})
	req.session.captcha = cap.text;//seesion 存取验证码数值
	res.json({
		status:0,
		msg:cap.data
	})
})

//生成Token的方法
// function generateToken(info,data){
//    let content = info //生成token的主要信息
//    let secretOrPrivateKey = "suiyi" //这是加密的key(秘钥)
//    let token = jwt.sign(content,secretOrPrivateKey,{
//        expiresIn:60*60*1 //一个小时过期
//    })
//    data[0].token = token;//token 写入数据库
//    db.users(data[0]).save((err)=>{
//        if(err){
//            res.json({
               
//            })
//        }
//    })

// }

//用户登录
router.post('/login',(req,res,next)=>{
	let param = {
		userName:req.body.userName,
		passWord:req.body.passWord,
	}
  let captcha = req.body.captcha.toLowerCase();
  let sessionCaptcha = req.session.captcha.toLowerCase();
	if(captcha ==sessionCaptcha){
		User.find(param,(err,data)=>{
			if(err){
			res.json({
					status:'1',
					msg:err.message
				})
			}else{
			if(data.length===1){
                let content ={name:param.userName} ;//要生成的token的主体信息
                let secretOrPrivateKey = "suiyi" //这是加密的key(秘钥)
                console.log(1)
                let token = jwt.sign(content,secretOrPrivateKey,{
                    expiresIn:60
                })
                console.log(token)
                data[0].token = token
                console.log(data[0])
                User.update({userName:data[0].userName},data[0],(err)=>{
                    if(err){
                        res.json({
                            status:1,
                            msg:err.message
                        })
                        return
                    }
                    res.json({
                        'status':0,
                        'msg':"登录成功",
                        'token':token,
                        'userName':req.body.userName
                    })
                })
				
			}else{
				res.json({
					status:1,
					msg:"账号或用户名错误"
				})
			}
			}
		})
	}else{
		res.json({
			status:1,
			msg:"验证码错误"
		})
	}
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
