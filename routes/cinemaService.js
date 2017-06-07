var express = require('express');	//Node.js Web Services
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control
var rp = require('request-promise'); 
var fs = require('fs');
var http = require('http')

var router = express.Router();

var raw_cinema = JSON.parse(fs.readFileSync('./data/Cinema_Guangzhou.json'));

function reqShowTimes(_uri) {
	return  {
	    method: 'POST',
	    uri: 'http://localhost:5000/shows',
	    headers: {
	     'Content-Type': 'application/json; charset=utf-8'
	     },
	    body: {
	    	curi: _uri
	    },
	    json: true // Automatically parses the JSON string in the response
	}
}

function parseFeature(feature) {
	var parsed = {};
	feature.forEach(item => {
		pair = item.split(':')
		parsed[pair[0]] = pair[1];
	});
	return parsed;
}

var _cinemas = [];
for (var c in raw_cinema.list) {

	// console.log(raw_cinema.list[c]);

	var feat = raw_cinema.list[c].feature;
	if (typeof(feat) === 'undefined') {

	}
	else {
		feat = parseFeature(feat.replace(/"|{|}/g,"").split(','));
	}

	_cinemas.push(
	{
		id: raw_cinema.list[c].cid,
		name: raw_cinema.list[c].cname,
		logo: raw_cinema.list[c].logo,
		address: raw_cinema.list[c].address,
		feature: feat,
		showtimepage: raw_cinema.list[c].showtimepage
	}
	);
	
}

router.get('/', (req, res, next) => {
	res.json({state: 'success', cinemas: _cinemas})
});

router.get('/show/:id', (req, res, next) => {

	console.log(typeof(parseInt(req.params.id)))
	var cinemaPage = _cinemas.find(c => c.id === parseInt(req.params.id)).showtimepage
	// console.log(cinemaPage)
	// console.log(rp(reqShowTimes(cinemaPage)))
	rp(reqShowTimes(cinemaPage))
		.then( body => {
			// console.log(body)
			res.json({status: 'success', shows:body})
		} )
		.catch( err => {
			res.json({status: 'failed', error:err})
		} )

});

module.exports = router;