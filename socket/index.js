var log = require('libs/log')(module);
var cookie = require('cookie');
var sessionStore = require('libs/sessionStore');
var async = require('async');
var User = require('models/user').User;
var HttpError = require('error').HttpError;
var config = require('config');
var connect = require('connect');

function loadSession(sid, callback) {
	sessionStore.load(sid, function (err, session) {
		if (!arguments.length) {
			return callback(null, null)
		} else {
			return callback(null, session)
		}
	})
}

function loadUser(session, callback) {
	if (!session.user) {
		return callback(null, null);
	}

	User.findOne({ _id: session.user }, function (err, user) {
		if (err) return callback(err);
		if(!user){
			log.debug('user not found');
			return callback(null, null);
		}

		log.debug('user find result: ' + user);
		callback(null, user);
	});


}

module.exports = function (server) {
	io = require('socket.io').listen(server);
	io.set('logger', log);
	io.set('authorization', function (handshake, callback) {
		async.waterfall([
			function (callback) {

				handshake.cookies = cookie.parse(handshake.headers.cookie || '');
				log.info(handshake.cookies);
				var sidCockie = handshake.cookies[config.get('session:key')];
				log.info('sid coockie:' + sidCockie);
				var sid = connect.utils.parseSignedCookie(sidCockie, config.get('session:secret'));

				loadSession(sid, callback);
			},
			function (session, callback) {
				log.info('session:' + session);
				if (!session) {
					callback(new HttpError(401, "No session"));
				}
				handshake.session = session;
				loadUser(session, callback);
			},
			function (user, callback) {
				log.info('user:' + JSON.stringify(user));
				if(!user) return callback(403, "User not found");

				handshake.user = user;
				callback(null);
			}

		], function(err){
			log.info('err:' + JSON.stringify(err));
			if(!err) return callback(null, true);

			if(err instanceof  HttpError){
				return callback(null, false);
			}

			callback(err);
		})
	});

	io.sockets.on('connection', function (socket) {
		var username = socket.handshake.user.get('username');
		socket.broadcast.emit('join', username);

		socket.on('message', function (data, cb) {
			log.info(data);
			socket.broadcast.emit('message', username, data);
			cb('123');
		}).on('disconnect', function(){
				socket.broadcast.emit('leave', username);
			});
	});

	io.sockets.on('session:reload', function(sid){
		var clients = io.sockets.clients();
		clients.forEach(function(client){
			if(client.handshake.session.id != sid){
				return;
			}

			loadSession(sid, function(err, session){
				if(err){
					client.emit('error', 'server error');
					client.disconnect();
					return;
				}

				if(!session){
					client.emit("logout");
					client.disconnect();
					return;
				}

				client.handshake.session = session;
			})
		})
	});

	return io;


}