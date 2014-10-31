var User = require('models/user').User;
var HttpError = require('error').HttpError;
var ObjectId = require('mongodb').ObjectID;
var checkAuth = require('middleware/checkAuth');

module.exports = function (app) {


//	app.get('/Cinemas', function (req, res, next) {
//		var request = require("request");
////		res.writeHead(200, {
////			"Content-Type": "text/html; charset=utf-8"
////		});
//
//		request("http://kinoinfo.ru/api/cinema/?format=json", function (error, response, body) {
//			res.send(body);
//		});
//	})

	app.get('/', require('./frontpage').get);

	app.get('/chat', checkAuth, require('./chat').get);

	app.get('/login', require('./login').get);
	app.post('/login', require('./login').post);
	app.post('/logout', require('./logout').post);


//	app.get('/users', function (req, res, next) {
//		User.find(function (err, users) {
//			if (err) next(err);
//			res.send(users);
//		});
//	});
//
//	app.get('/user/:id', function (req, res, next) {
//		try{
//		var id = new ObjectId(req.params.id);
//		}catch(e){
//			return next(500);
//		}
//		User.findById(id, function (err, user) {
//			if (err) next(err);
//			if (!user) {
//				next(new HttpError(404, "User not found"))
//			} else {
//				res.send(user);
//			}
//		});
//	});

}