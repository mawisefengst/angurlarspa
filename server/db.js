const knex = require("knex");
const db = knex({
	client: "mysql",
	connection:{
		host: "localhost",
		user: "root",
		password:"201131",
		database:"ss_spa"
	}
});

/*
const db = knex({
	client: "mysql",
	connection:{
		host: "us-cdbr-iron-east-04.cleardb.net",
		user: "b3897cdedb4251",
		password: "7c69a6e6",
		database:"heroku_be87c02e2444534"
	}
});
*/

module.exports = db;