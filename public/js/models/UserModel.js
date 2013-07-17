if ( typeof window === 'undefined' ){
	eval('var Backbone	= require("backbone");' + 
		' 	  _ = require("underscore");');
}

'use strict';

module.exports = Backbone.Model.extend({
	defaults	: 	{id			: null,
					username	: null,
					email		: null,
					created		: null,
					last_change	: null,
					last_login	: null,
					failed_login_count	: null,
					avatar		: '/img/avatar.png'},
	
	initialize	: function(attributes, options){
		if ( attributes ) this.set(attributes);
		_.extend(this, options);
	},
});
