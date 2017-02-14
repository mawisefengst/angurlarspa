const router = require("express").Router();
const db = require("./db");
const bcrypt = require("bcrypt-nodejs");
const moment = require('moment');

router
    
    .get("/allscores",function(req,res,next){
      db("nps") 
        .then((nps) => {
            res.status(200).json(nps)
       },next);
    })

    .get("/scoreByEmail",function(req,res,next){
        var email = req.query.userEmail;
        db("nps")
          .where("email",email)
          .first()
           .then((post) => {
            if(post)  {
              var lastSurverTime = new Date(post.lastTime);
              var currentTime = new Date();
              var daysInMS = 1000*60*60;
              var daysInterval = 90;
              var timeDiff = Math.floor((currentTime.getTime() - lastSurverTime.getTime())/daysInMS);
              if(timeDiff > daysInterval * 24){
                res.status(200).json({status:"0",lastTime:timeDiff});
              }else{
                res.status(200).json({status:"1",lastTime:timeDiff});
              }
            }
            else {
              res.status(200).json({status:"0",lastTime:""});
            }
          })
    })

    .post("/newScore",function(req,res,next){
      var dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      //check last survey is less than 90 days, otherewise update recored;
      db("nps")
          .where("email",req.body.userEmail)
          .first()
           .then((post) => {
            if(post)  {
               db("nps")
                .where("email",req.body.userEmail)
                .update({score: req.body.score, text: req.body.feedback, lastTime: dateTime})
                 .then((score) =>{
                      if(score)  res.status(200).json({status:"0",message:"OK"})
                      else res.status(200).json({status:"200", message: "Error on database on updating rows"})
               },next);
            }
            else {
              //insert new record
                db("nps")
                  .insert({email: req.body.userEmail, score: req.body.score, text: req.body.feedback, lastTime: dateTime})
                  .then((score) =>{
                      if(score)  res.status(200).json({status:"0",message:"OK"})
                      else res.status(200).json({status:"200", message: "Error on database on creating rows"})
                   },next);
            }
          })
    })

    .get("/newPost",function(req,res,next){
      res.render("newPost",{message: "Add New Post"});
    })

    .post("/newPost",function(req,res,next){
  		db("content")
    		.insert({title: req.body.title, content: req.body.content, uid: req.session.uid})
    		.then((post) =>{
       			if(post) res.redirect("/posts");
       			else res.redirect("/");
       	 },next);
    })

    .get("/posts",function(req,res,next){
  		db("content")
        .then((posts) =>{
          posts.map((post) => {
            post.content = post.content.substring(0,200);
          })
          res.render("posts",{posts: posts})
      	},next);
    })

    .get("/post/edit/:id",function(req,res,next){
        db("content")
        .where("cid",req.params.id)
        .first()
        .then((post) => {
            if(post)  res.render("editPost",{post: post, message: "Edit Your Post"});
            else res.redirect("/posts");
        },next);
    })

	  .post("/post/edit/:id",function(req,res,next){
      db("content")
        .where("cid",req.params.id)
        .update({title: req.body.title, content: req.body.content, uid: req.session.uid})
        .then((post) =>{
            if(post) res.redirect("/posts");
            else res.redirect("/");
         },next);
    })


    .get("/templates/:title",function(req,res,next){
        db("content")
        .where("title",req.params.title.replace(/ /g,'').toLowerCase())
        .first()
        .then((post) => {
            if(post)  res.render("post",{layout: 'post', post: post});
            else{
               db("content")
              .where("title","home")
              .first()
              .then((post) => {
                  res.render("post",{layout: 'post', post: post});
               })
            }
        },next);
    })

module.exports = router    