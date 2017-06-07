var express = require('express');	//Node.js Web Services
var bodyParser = require('body-parser');
var session = require('express-session');	//Express() session control
var rp = require('request-promise'); 

var router = express.Router();

var M = require('./model.js');

const reqHotMovies = {
    method: 'GET',
    uri: 'http://api.douban.com/v2/movie/in_theaters',
    json: true 
};

const reqNewMovies = {
	method: 'GET',
	uri: 'http://api.douban.com/v2/movie/coming_soon',
	json: true 
}

function reqMovieBy(id) {
  return {
    method: 'GET',
    uri: 'http://api.douban.com/v2/movie/subject/' + id,
    json: true 
  }
}

router.get('/air', (req, res, next) => {

	console.log('Requesting for on air movies.');
	//Create Http Request

	rp(reqHotMovies)
		.then(body => {
			//List to return
			const hotMovies = [];

			body.subjects.forEach(element => {
				//console.log(element);
				//First check if the movie exists in our cache
				M.Movie.findOne({_id : element.id})
					.then (
						function (movie) {
							//console.log(movie);
							var movie = new M.Movie({
								_id : element.id
							});
							movie.save();
							}
						,
						function (err) {
							res.json({state: 'failed', err:error});
							conosle.log(err);
						});

				hotMovies.push(element);
				//console.log(2);
			}, this);
			//console.log(3);
			res.json({state: 'success', air: hotMovies});
		})
		.catch( error => {
		res.json({state: 'failed', err: error});
		} )

});

router.get('/new', (req, res, next) => {

	console.log('Requesting for on air movies.');
	//Create Http Request
	rp(reqNewMovies)
		.then(body => {
			//List to return
			const newMovies = [];

			body.subjects.forEach(element => {
				//console.log(element);
				//First check if the movie exists in our cache
				M.Movie.findOne({_id : element.id})
					.then (
						function (movie) {
							//console.log(movie);
							var movie = new M.Movie({
								_id : element.id
							});
							movie.save();
							}
						,
						function (err) {
							res.json({state: 'failed', err:error});
							conosle.log(err);
						});

				newMovies.push(element);
				//console.log(2);
			}, this);
			//console.log(3);
			res.json({state: 'success', air: newMovies});
		})
		.catch( error => {
		res.json({state: 'failed', err: error});
		} )

});

router.get('/id/:id', (req, res, next) => {

	console.log("Getting movie by id");

	rp(reqMovieBy(req.params.id))
		.then(body => {
				console.log(body);
				res.json({state: 'success', movie:body});
			})
});

module.exports = router;










