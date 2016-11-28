const router = require("express").Router();
const db = require("./db");
const bcrypt = require("bcrypt-nodejs");

router
    .get("/admin",function(req,res,next){
      //res.sendFile(__dirname + "/templates/userLogin.html");
      res.render("userSignup",{"message": "Admin Tool"});
    })

    .post("/admin",function(req,res,next){
    	db("users").
    	where("email",req.body.email). 
    	first().
    	then((user) =>{
    		if(user) {
          if(bcrypt.compareSync(req.body.password, user.password)){
            req.session.username = user.email;
            req.session.uid = user.uid;
            res.redirect("/posts");
          }else{
            res.render("userSignup",{"message": "Admin Tool", "errorMessage": "Please enter valid username and password"});
          }
    		}
    		else  res.render("userSignup",{"message": "Admin Tool", "errorMessage": "Please enter valid username and password"});
    	},next);
    })
   
    .get("/signup",function(req,res,next){
      res.sendFile(__dirname + "/templates/userSignup.html");
    })

    .post("/signup",function(req,res,next){
      db("users").
      where("email",req.body.email).
      first().
      then((user) =>{
          if(user) {
            res.send("signed up error");
          }
          else {
            db("users")
            .insert({email: req.body.email, password: bcrypt.hashSync(req.body.password)}).
            then((user) => {
                req.session.username = user.email;
                req.session.uid = user.uid;
                res.redirect("/posts");
            });
          }
      },next);
    })

module.exports = router    