exports.post = function(req, res, next){
	var sid = req.session.id;
	req.session.destroy(function(){
		var io = req.app.get('io');
		io.sockets.$emit("session:reload", sid);
		res.redirect('/');
	});

}