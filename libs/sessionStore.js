var express = require('express');
var mongoose = require('libs/mongoose');
var MongoStore = require('connect-mongo')(express);

module.exports = new MongoStore({mongoose_connection: mongoose.connection});