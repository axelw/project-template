'use strict';

var	HomeView	= require('./views/HomeView');

module.exports = Backbone.Router.extend({ 		
	root	: '/', 
	views	: [], 
	config	: {},
	routes 	: { ''	: 'home',
			'*other': 'defaultRoute' },

	initialize	: function(options){
		_.templateSettings = { interpolate : /\{\{(.+?)\}\}/g };
		this.createViews();
		this.renderViews();
	},

	createViews	: function(){
		this.views.HomeView = new HomeView();
	},

	renderViews	: function(){
		$('body').append(this.views.HomeView.render().el);
		// this.views.workspace.append('header', this.views.header.render().el);
	}	
});
