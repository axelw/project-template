'use strict';

var loader = require('../loader');

module.exports = Backbone.View.extend({

	id : 'HomeView',

	// Delegating events only work for delegate-able events: not `focus`, `blur`, and
	// not `change`, `submit`, and `reset` in Internet Explorer (see backbone.js)
	events : {
	},

	initialize : function() {
		this.template = loader.getTemplate(this.id);
	},

	render : function(callback){
		$(this.el).html(this.template())
		return this;
	},
});

