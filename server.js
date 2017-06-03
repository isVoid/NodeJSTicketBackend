var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/ticketSystem')
var autoinc = require('mongoose-id-autoinc');
var express = require('express');	//Node.js Web Services
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control
var app = express();
app.use(bodyParser.json());
app.use(session({secret: 'nottelling'}))

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Mongoose:: MongoDB connected!");
});

//Setting up database schema.

autoinc.init(db);	//Plugin for ID auto increment.

/*
*	Entity: User
#	String: Email
#	Number: password
#	Number: Phone
*/
var UserSchema = mongoose.Schema({
	email : String,
	password : Number,
	phone : Number,
	myTickets : [{ type: Schema.Types.ObjectId, ref:'MovieTicket' }]	//One to Many
});
UserSchema.plugin(autoinc.plugin, {  model : 'User' }); //Auto Increment ID
var User = db.model('User', UserSchema); //Compile Schema

/*
*	Entity: Movie Ticket
*	Number: Price
*/
var MovieTicketSchema = mongoose.Schema({
	price : Number,
	myUser : [{ type: Schema.Types.ObjectId, ref:'User' }]
});
MovieTicketSchema.plugin(autoinc.plugin, {  model : 'MovieTicket' });
var MovieTicket = db.model('MovieTicket', MovieTicketSchema);


//Setting up REST services
var sess;	//A global session object
app.post('/login', function (req, res)  {

	sess = req.session;
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
		User.findOne({ email : e }, function (err, currentUser) {
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
	var newUser = new User({
		'email' : req.body.email,
		'password' : req.body.password,
		'phone' : req.body.phone
	});
	newUser.save();
	sess.email = newUser.email;
	res.status(201);
	res.send('User not exist, auto created. Welcome ' + newUser.email + '!');

});

app.get('/myTickets', function (req, res) {

	sess = req.session;

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

var server = app.listen(8081, function() {
	var host = server.address().address
	var port = server.address().port

	console.log("Listening:: http://%s:%s", host, port);

});