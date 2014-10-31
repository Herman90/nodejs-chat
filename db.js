var mongoose = require('libs/mongoose');
var User = require('models/user').User;
var async = require('async');

function openDatabase(callback) {
	mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
	var db = mongoose.connection.db;
	db.dropDatabase(callback);
}

function requireModules(callback){
	require('models/user');
	async.each(Object.keys(mongoose.models), function(modelName, callback){
		mongoose.models[modelName].ensureIndexes(callback);
	}, callback);
}

function addUsers(callback) {
	var users = [
		{username: "Admin", password: "1231456"},
		{username: "Bob", password: "verydificultpassword"},
		{username: "Kate", password: "1231456"}
	];

	async.each(users,
		function (item, callback) {
			var user  = new mongoose.models.User(item);
			user.save(callback);
		},
		callback);
}

async.series([
	openDatabase,
	dropDatabase,
	requireModules,
	addUsers
], function (error, results) {
	console.log(arguments);
	mongoose.disconnect();
});

