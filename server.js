const express = require("express")
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./server/db");
const authRouter = require("./server/auth");
const postRouter = require("./server/post");
const handlebars = require("express-handlebars");
const request = require("request");

app
   .use(function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "*");
       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
   })
   .engine("hbs",handlebars({
   		extname: "hbs",
   		defaultLayout: "layout",
   		layoutsDir: __dirname + "/server/templates/"
   	}))
   .set("views", __dirname + "/server/templates")
   .set("view engine", "hbs")
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({extended:false}))
   .use(session({secret: "sport system single page application",resave:false,saveUninitialized: false}))
   .use(authRouter)
   .use(postRouter)
   .use("/styles", express.static(__dirname + "/client/styles"))
   .use("/scripts", express.static(__dirname + "/client/scripts"))
   .use("/fonts", express.static(__dirname + "/client/fonts"))
   .use("/images", express.static(__dirname + "/client/images"))
  // .use("/templates", express.static(__dirname + "/client/templates"))
   .get("/",function(req,res,next){
      res.sendFile(__dirname + "/client/index.html");
    })
   .get('/service', function (_, res) { 
		var url = "https://stagingsecure.sportssystems.com/ssapi/index.cfm/menu";
		var result;
		request({ 
			url: url, 
			json: true
		}, function (error, response, body) {
		    if (!error && response.statusCode === 200) {
		        res.json(body);
		    }
		});
	})
   .listen(process.env.PORT || 9091);