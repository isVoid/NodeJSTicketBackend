var express = require('express');	//Node.js Web Services
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control

var router = express.Router();

const model = require('./model.js');

//Setting up REST services
router.post('/', function (req, res)  {

	var sess = req.session;
	console.log("Current Session: " + sess.email);

	if (sess.email) {
		//User has logged in
		res.status(202);
		var alreadyLoggedIn = 'You have already logged in';
		console.log(alreadyLoggedIn);
		res.send(alreadyLoggedIn);
		return;
	}
	else {
		var e = req.body.email;
		console.log(e + " is attempting to login");
		model.User.find({ email : e }, function (err, currentUser) {
			console.log(currentUser);
			//User Exists
			if (currentUser.length > 0) {
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
					console.log("Wrong Password!");
					res.status(400);
					res.send('Wrong Password!');
					return;
				}
			}
			//User does not exist
			else {
				//User not found, create it
				var newUser = new model.User({
					email : req.body.email,
					password : req.body.password,
					phone : req.body.phone
				});
				newUser.save();
				//help him login
				sess.email = newUser.email;
				console.log("User Created.")
				res.status(201);
				res.send('User not exist, auto created. Welcome ' + newUser.email + '!');
			}
		});
		
	}

});

router.get("/exists/:email", (req, res) => {

	var e = req.params.email;
	console.log(e + " is requesting for user count.");
	model.User.count({email: e}, (err, count) => {
		if (count > 0) {
			res.status(211);
			res.send("User exists");
		}
		else {
			res.status(210);
			res.send("User not exist");
		}
	});

});

module.exports = router;
