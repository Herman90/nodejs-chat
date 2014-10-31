var log = require('libs/log')(module);
module.exports = function(req, res, next){
	res.sendHttpError = function(error){
		res.status(error.status);
		if(res.req.headers['x-requested-with'] === 'XMLHttpRequest'){
			res.json(error);
		}else{
			log.info('render error');
			res.render("error", {error: error});
		}
	}

	next();
}