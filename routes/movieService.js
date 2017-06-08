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

const hotMovies = [];
var finishFetchingMovies;
rp(reqHotMovies)
		.then(body => {
			//List to return
			const airingMoviesID = []
			body.subjects.forEach(element => {
				var hotObject = {
					mid : element.id,
					smallImageURI : element.images.small,
					mediumImageURI : element.images.medium,
					largeImageURI : element.images.large
				}
				airingMoviesID.push(hotObject);
			}, this);

			return airingMoviesID;
		})
		.catch(err => {
			console.log("Error fetch id: " + err);
		})
		.then( airingMoviesID => {
			
			airingMoviesID.forEach(hotObject => {

				console.log(hotObject.mid);
				rp(reqMovieBy(hotObject.mid))
					.then(body => {
						console.log(body);
						var m = {
							mid : hotMovies.length + 1,
							douid : body.id,
							name : body.title,
							nameEng : body.original_title,
							audience_rating : body.rating.average,
							audience_num : body.ratings_count,
							movieType : body.genres.join(','),
							movieSourceDest : body.countries.join(','),
							movieLength : body.durations,
							nWantSee : body.wish_count,
							oneSentence : "一句话描述，豆瓣死不给",
							movieIntro : body.summary,
							smallImageURI : hotObject.smallImageURI.replace(/douban.com/, "doubanio.com"),
							mediumImageURI : hotObject.mediumImageURI.replace(/douban.com/, "doubanio.com"),
							largeImageURI : hotObject.largeImageURI.replace(/douban.com/, "doubanio.com"),
							// staffList : body.casts,
							premiereDate : '2017-09-09',	//No data
							onair : true

						}
						hotMovies.push(m);
					})
			})	
		})
		.catch(err => {
			console.log("Error fetch movie: " + err);
		})

router.get('/air', (req, res, next) => {

	console.log('Requesting for on air movies.');

	res.json(hotMovies);

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
			}, this);
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
				// console.log(body);
				var m = {
					mid : body.id,
					name : body.title,
					nameEng : body.original_title,
					audience_rating : body.rating.average,
					audience_num : body.ratings_count,
					movieType : body.genres.join(','),
					movieSourceDest : body.countries.join(','),
					movieLength : body.durations,
					nWantSee : body.wish_count,
					movieIntro : body.summary,
					// staffList : body.casts,
					premiereDate : '2017-09-09'	//No data
				}
				
				res.json(m);
				//res.json({state: 'success', movie:body});
			})
});

module.exports = router;










