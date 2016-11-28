const router = require("express").Router();
const db = require("./db");
const bcrypt = require("bcrypt-nodejs");

router

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