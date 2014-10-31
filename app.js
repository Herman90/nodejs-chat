/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('libs/log')(module);
var mongoose = require('libs/mongoose');
var HttpError = require('error').HttpError;

var app = express();
app.engine('ejs', require('ejs-locals'));

app.set('port', process.env.PORT || config.get('port'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(config.get('session:secret')));

var MongoStore = require('connect-mongo')(express);

var sessionStore = require('libs/sessionStore');

app.use(express.session({
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	store: sessionStore
}));
//app.use(function(request, response, next){
//	request.session.numberOfVisits += 1;
//	response.send('Visit: ' + request.session.numberOfVisits);
//})
app.use(require('middleware/sendHttpError'));
app.use(require('middleware/loadUser'));
app.use(app.router);
require('routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
server.listen(app.get('port'), function () {
	log.info('Express server listening on port ' + config.get('port'));
});


app.use(function (error, request, response, next) {
	if (typeof error === 'number') {
		error = new HttpError(error);
	}
	log.info(error);
	if (error instanceof HttpError) {
		log.info('custom error');
		response.sendHttpError(error);
	} else {
		if (app.get('env') === 'development') {
			express.errorHandler()(error, request, response, next);
		} else {
			log.error(error);
			error = new HttpError(500);
			response.sendHttpError(error);
		}
	}


});

var io = require('./socket')(server);
app.set('io', io);


