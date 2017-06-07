var express = require('express');	//Node.js Web Services
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control

var router = express.Router();

const model = require('./model.js');

//Setting up REST services
router.post('/', function (req, res)  {

	var sess = req.session;
	if (sess.email) {
		//User has logged in
		res.status(200);
		var alreadyLoggedIn = 'You have already logged in';
		console.log(alreadyLoggedIn);
		res.send(alreadyLoggedIn);
		return;
	}
	else {
		var e = req.body.email;
		console.log(e);
		model.User.findOne({ email : e }, function (err, currentUser) {
			console.log(currentUser);
			if (currentUser) {
				//User exists and password correct
				if (currentUser.password == req.body.password) {
					sess.email = currentUser.email;
					res.status(200);
					var success = 'You have logged in!';
					console.log(success);
					res.send(success);
					return;
				}
				//User exists, password incorrect.
				else {
					res.status(400);
					res.send('Wrong Password!');
					return;
				}
			}
		});
		
	}

	//User not found, create it.
	var newUser = new model.User({
		email : req.body.email,
		password : req.body.password,
		phone : req.body.phone
	});
	newUser.save();
	sess.email = newUser.email;
	res.status(201);
	res.send('User not exist, auto created. Welcome ' + newUser.email + '!');

});

module.exports = router;
