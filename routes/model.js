var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/ticketSystem')
var autoinc = require('mongoose-id-autoinc');

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
*	Entity: Movie
*/
var MovieSchema = mongoose.Schema({
	_id : Number,
	title : String,
	original_title : String,
	image : String,
	genres : String,
	rating : Number
});
var Movie = db.model('Movie', MovieSchema);

/*
*	Entity: Movie Ticket
*	Number: Price
*/
var MovieTicketSchema = mongoose.Schema({
	price : Number,
	orderTimestamp : Date,
	paidTimestamp : Date,
	myUser : { type: Schema.Types.ObjectId, ref:'User' },	//Many to one
	myMovieArrangement : { type: Schema.Types.ObjectId, ref:'MovieArrangement' }	//One to One
});
MovieTicketSchema.plugin(autoinc.plugin, {  model : 'MovieTicket' });
var MovieTicket = db.model('MovieTicket', MovieTicketSchema);

/*
*	Entity: Cinema
*/
var CinemaSchema = mongoose.Schema({
	brand: String,
	address: String,
	specialHall: String,
	services: String,
	myHalls: [{ type: Schema.Types.ObjectId, ref:'Hall' }],	//One To Many
	myMovieArrangements: [{ type: Schema.Types.ObjectId, ref:'MovieArrangement' }]	//One to Many
});
CinemaSchema.plugin(autoinc.plugin, { model : 'MovieTicket' });
var Cinema = db.model('Cinema', CinemaSchema);

/*
*	Entity: Hall
*/
var HallSchema = mongoose.Schema({
	seatCount: Number,
	seatArrange: String,
	type: String,
	myCinema: { type: Schema.Types.ObjectId, ref:'Cinema' },	//Many to One
	mySeats: [{ type: Schema.Types.ObjectId, ref:'Seat' }]	//One to Many
});
HallSchema.plugin(autoinc.plugin, { model : 'Hall' });
var Hall = db.model('Hall', HallSchema);

/*
*	Entity: Seat
*/
var SeatSchema = mongoose.Schema({
	type: String,
	myHall: { type: Schema.Types.ObjectId, ref:'Hall' },	//Many to one
	myMovieArrangements: [{ type: Schema.Types.ObjectId, ref:'MovieArrangement' }]	//one to many
});
SeatSchema.plugin(autoinc.plugin, { model : 'Seat' });
var Seat = db.model('Seat', SeatSchema);

/*
*	Entity: Movie Arrangement
*/
var MovieArrangementSchema = mongoose.Schema({
	startDate: Date,
	endDate: Date,
	price: Number,
	myCinema: { type: Schema.Types.ObjectId, ref:'Cinema' },	//Many to One
	myTicket: { type: Schema.Types.ObjectId, ref:'MovieTicket' },	//One to One
	mySeat: { type: Schema.Types.ObjectId, ref:'Seat' }	//Many to one
});
MovieArrangementSchema.plugin(autoinc.plugin, { model : 'MovieArrangement' });
var MovieArrangement = db.model('MovieArrangement', MovieArrangementSchema);

/*
*	Entity: Payment
*	TODO: Add Payment Portal ID
*/
var PaymentSchema = mongoose.Schema({
	
});
PaymentSchema.plugin(autoinc.plugin, { model : 'Payment' });
var Payment = db.model('Payment', PaymentSchema);

//Making DAOs public
exports.User = User;
exports.Movie = Movie;
exports.MovieTicket = MovieTicket;
exports.Cinema = CinemaSchema;
exports.Hall = Hall;
exports.Seat = Seat;
exports.Payment = Payment;




