var	loader = require('./loader'),
	router = require('./router'),
	UserModel = require('./models/UserModel');

// main.js is the entry point of this application. The very first action is
// to let the loader load the template data needed for rendering any view.
loader.loadTemplates(function(){
	'use strict';

	var um = new UserModel(null, {urlRoot : '/cruser'});
	um.fetch({	success : function(model, response, options){
					run(response);
				},
				error : function(model, response, options){
					console.log('Error on load: ' + JSON.stringify(response));
					run(response);
				}	
	});

	function run(user){
		var app = new router({sessionUser: user});
		Backbone.history.start({ pushState: true, root: app.root });

		// The following piece of code is bluntly copied from Addy Osmani's book
		// 'Developing Backbone.js Applications'. 
		// Get it here: http://shop.oreilly.com/product/0636920025344.do
		// or here: https://github.com/addyosmani/backbone-fundamentals
		$(document).on('click', 'a:not([data-bypass])', function(evt) {
			var href = $(this).attr('href');
			if (href && href.indexOf('#') === 0) {
				evt.preventDefault();
				Backbone.history.navigate(href, true); 
			}
		});	
	};
});

