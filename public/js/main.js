/**
 * Created by German.Demsky on 18/02/14.
 */
(function($){
//	(function() {
//
//		var proxiedSync = Backbone.sync;
//
//		Backbone.sync = function(method, model, options) {
//			options || (options = {});
//
//			if (!options.crossDomain) {
//				options.crossDomain = true;
//			}
//
//			if (!options.xhrFields) {
//				options.xhrFields = {withCredentials:true};
//			}
//
//			return proxiedSync(method, model, options);
//		};
//	})();

	var Cinema = Backbone.Model.extend({
		defaults: {
			address: '',
			name: '',
			city_name: ''
		}
	});

	var CinemaList = Backbone.Collection.extend({
		model: Cinema,
		url: '/data'
	})

	var cinemaList = new CinemaList();
	cinemaList.fetch();
	window.cinemaList = cinemaList;


})(jQuery);
