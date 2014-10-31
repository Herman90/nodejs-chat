var User = require('models/user').User;
var AuthError = require('models/user').AuthError;
var HttpError = require('error').HttpError;


exports.get = function (req, res) {
	res.render('login');
}

exports.post = function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.authorize(username, password, function (error, user) {
		if (error) {
			if(error instanceof AuthError){
				return next(new HttpError(403, error.message));
			}
			return next(error);
		}

		req.session.user = user._id;
		res.redirect("/chat");
	})


}