var express = require('express')
var router = express.Router()
var models = require('../models.js');
var post = models.post;
var user = models.user;
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bh4radwaj:lRJoR1LCaegtv4Cd@cluster0.rhba5.mongodb.net/ejs',{ useNewUrlParser: true });

router.post('/posts/insert',async function(req,res,next){
    let u = await user.findOne();
    let p1 = new post({title:req.body.title,body:req.body.body,author_id:u._id});
    p1.save();
    res.json({inserted:'success',grretings:'how are you'});
});

router.get('/posts',async function(req,res,next){
    posts_ = await post.find();
    posts = [];
    posts_.forEach(post => {
      let p = {};
      p.id = post.id;
      p.title = post.title;
      p.body = post.body;
      posts.push(p);
    });
    res.json(posts);
});

router.get('/posts/:id',async function(req,res,next){
    post_ = await post.findById(req.params.id);
    res.json(post_);
});

router.patch('/posts/:id',function(req,res,next){
  post.findById(req.params.id,(err,post)=>{
      if(err) console.log(err);
      post.body = req.body.body;
      post.title = req.body.title;
      post.save((err)=> console.log(err));
      res.json({updataion:'success'});
  });
});

router.delete('/posts/:id',function(req,res,next){
  post.deleteOne({_id:req.params.id},(err,data)=>{
      if(err) console.log(err);
      res.json(data);
  });
});

module.exports = router; 
