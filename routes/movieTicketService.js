var express = require('express');	//Node.js Web Services
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control

var router = express.Router();

var M = require('./model.js');

//Ticket Services
router.get('/', function (req, res) {

	var sess = req.session;

	if (sess.email) {

		User
			.find({})
			.populate('myTickets')
			.exec(function (err, tickets) {
				console.log(tickets);
				res.status(200);
				res.send(JSON.stringify(tickets["myTickets"]));
				return;
			});

	}
	else {
		console.log('Invalid session!');
		res.status(400);
		res.send('Invalid Session. Please retry login.');
	}

});

router.post('/', function (req, res) {

	var sess = req.session;

	if (sess.email) {

		

	}
	else {
		console.log('Invalid session!');
		res.status(400);
		res.send('Invalid Session. Please retry login.');
	}

});

module.exports = router;