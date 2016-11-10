const path = require('path')
const express = require('express')
const app = express()
const indexPath = path.join(__dirname, '/angularspa/index.html')
const request = require("request")


app.use('/styles', express.static(path.join(__dirname, '/angularspa/styles')))
app.use('/scripts', express.static(path.join(__dirname, '/angularspa/scripts')))
app.use('/', express.static(path.join(__dirname, '/angularspa/')))
app.get('/', function (_, res) { res.sendFile(indexPath) })

//proxy service from 3red party API

app.get('/service', function (_, res) { 
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


app.listen(process.env.PORT || 8080);

