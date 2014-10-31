var path = require('path');
var http = require('http');
var util = require('util');

function HttpError(code, message){
	Error.apply(this, arguments);
	Error.captureStackTrace(this, HttpError);

	this.status = code;
	this.message = message || http.STATUS_CODES[code] || "ERROR";
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
exports.HttpError = HttpError;