'use strict';

module.exports = {

	bundle : '',

	// Load the aggregated template file and cache it.
	loadTemplates : function(callback){
		var def = new $.Deferred(),
			self = this;

		$.ajax({
			url		: 'templates/tbundle.html',
			type	: 'get',
			dataType: 'text',
			cache	: true,
			global	: false,

			success: function(data) {
				self.bundle = data;
				def.resolve();
			}
		});

		$.when(def).done(callback);
	},			

	// Fetch a template from the cached aggregated template file. 
	getTemplate	: function(id){
		var a = $(this.bundle).find('#'+id).children(),
			buf = '';
		for ( var i = 0; i < a.length; i++){
			buf += a[i].outerHTML;
		}
		return _.template(buf);
	}
};
