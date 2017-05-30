var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myTestSystem')
var express = require('express');
var app = express();
var fs = require("fs");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Mongoose:: MongoDB connected!");
});

var kittySchema = mongoose.Schema({
	name: String
});

kittySchema.methods.speak = function () {
	var greeting = this.name
		? "Meow name is " + this.name
		: "I don't have a name";
		console.log(greeting);
}

//Compiling Schema into Model.
var Kitten = mongoose.model("Kitten", kittySchema);

var silence = new Kitten({ name : 'Silence' });
console.log(silence.name);

var fluffy = new Kitten({ name : 'fluffy' });
fluffy.speak();

fluffy.save(function (err, fluffy) {
	if (err) return console.error(err);
	fluffy.speak();
})

// Kitten.find(function (err, kittens) {
// 	if (err) return console.erro(err);
// 	console.log(kittens);
// })

app.get('/:id', function (req, res)  {
	fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
		data = JSON.parse(data);

		// console.log("user" + req.params.id);
		var user = data["user" + req.params.id];

		console.log(user);
		res.end( JSON.stringify(user) );
		// console.log(data);
		// res.end(data);
	});

});

var server = app.listen(8081, function() {
	var host = server.address().address
	var port = server.address().port

	console.log("Listening:: http://%s:%s", host, port);

});