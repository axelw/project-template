;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
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


},{"./loader":2,"./router":3,"./models/UserModel":4}],2:[function(require,module,exports){
(function(){'use strict';

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

})()
},{}],4:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./views/HomeView":5}],5:[function(require,module,exports){
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


},{"../loader":2}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYXhlbC9EZXZlbG9wbWVudC9wcm9qZWN0QlAvcHVibGljL2pzL21haW4uanMiLCIvVXNlcnMvYXhlbC9EZXZlbG9wbWVudC9wcm9qZWN0QlAvcHVibGljL2pzL2xvYWRlci5qcyIsIi9Vc2Vycy9heGVsL0RldmVsb3BtZW50L3Byb2plY3RCUC9wdWJsaWMvanMvbW9kZWxzL1VzZXJNb2RlbC5qcyIsIi9Vc2Vycy9heGVsL0RldmVsb3BtZW50L3Byb2plY3RCUC9wdWJsaWMvanMvcm91dGVyLmpzIiwiL1VzZXJzL2F4ZWwvRGV2ZWxvcG1lbnQvcHJvamVjdEJQL3B1YmxpYy9qcy92aWV3cy9Ib21lVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbInZhclx0bG9hZGVyID0gcmVxdWlyZSgnLi9sb2FkZXInKSxcblx0cm91dGVyID0gcmVxdWlyZSgnLi9yb3V0ZXInKSxcblx0VXNlck1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbHMvVXNlck1vZGVsJyk7XG5cbi8vIG1haW4uanMgaXMgdGhlIGVudHJ5IHBvaW50IG9mIHRoaXMgYXBwbGljYXRpb24uIFRoZSB2ZXJ5IGZpcnN0IGFjdGlvbiBpc1xuLy8gdG8gbGV0IHRoZSBsb2FkZXIgbG9hZCB0aGUgdGVtcGxhdGUgZGF0YSBuZWVkZWQgZm9yIHJlbmRlcmluZyBhbnkgdmlldy5cbmxvYWRlci5sb2FkVGVtcGxhdGVzKGZ1bmN0aW9uKCl7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgdW0gPSBuZXcgVXNlck1vZGVsKG51bGwsIHt1cmxSb290IDogJy9jcnVzZXInfSk7XG5cdHVtLmZldGNoKHtcdHN1Y2Nlc3MgOiBmdW5jdGlvbihtb2RlbCwgcmVzcG9uc2UsIG9wdGlvbnMpe1xuXHRcdFx0XHRcdHJ1bihyZXNwb25zZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yIDogZnVuY3Rpb24obW9kZWwsIHJlc3BvbnNlLCBvcHRpb25zKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnRXJyb3Igb24gbG9hZDogJyArIEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSk7XG5cdFx0XHRcdFx0cnVuKHJlc3BvbnNlKTtcblx0XHRcdFx0fVx0XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIHJ1bih1c2VyKXtcblx0XHR2YXIgYXBwID0gbmV3IHJvdXRlcih7c2Vzc2lvblVzZXI6IHVzZXJ9KTtcblx0XHRCYWNrYm9uZS5oaXN0b3J5LnN0YXJ0KHsgcHVzaFN0YXRlOiB0cnVlLCByb290OiBhcHAucm9vdCB9KTtcblxuXHRcdC8vIFRoZSBmb2xsb3dpbmcgcGllY2Ugb2YgY29kZSBpcyBibHVudGx5IGNvcGllZCBmcm9tIEFkZHkgT3NtYW5pJ3MgYm9va1xuXHRcdC8vICdEZXZlbG9waW5nIEJhY2tib25lLmpzIEFwcGxpY2F0aW9ucycuIFxuXHRcdC8vIEdldCBpdCBoZXJlOiBodHRwOi8vc2hvcC5vcmVpbGx5LmNvbS9wcm9kdWN0LzA2MzY5MjAwMjUzNDQuZG9cblx0XHQvLyBvciBoZXJlOiBodHRwczovL2dpdGh1Yi5jb20vYWRkeW9zbWFuaS9iYWNrYm9uZS1mdW5kYW1lbnRhbHNcblx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnYTpub3QoW2RhdGEtYnlwYXNzXSknLCBmdW5jdGlvbihldnQpIHtcblx0XHRcdHZhciBocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG5cdFx0XHRpZiAoaHJlZiAmJiBocmVmLmluZGV4T2YoJyMnKSA9PT0gMCkge1xuXHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0QmFja2JvbmUuaGlzdG9yeS5uYXZpZ2F0ZShocmVmLCB0cnVlKTsgXG5cdFx0XHR9XG5cdFx0fSk7XHRcblx0fTtcbn0pO1xuXG4iLCIoZnVuY3Rpb24oKXsndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdGJ1bmRsZSA6ICcnLFxuXG5cdC8vIExvYWQgdGhlIGFnZ3JlZ2F0ZWQgdGVtcGxhdGUgZmlsZSBhbmQgY2FjaGUgaXQuXG5cdGxvYWRUZW1wbGF0ZXMgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0dmFyIGRlZiA9IG5ldyAkLkRlZmVycmVkKCksXG5cdFx0XHRzZWxmID0gdGhpcztcblxuXHRcdCQuYWpheCh7XG5cdFx0XHR1cmxcdFx0OiAndGVtcGxhdGVzL3RidW5kbGUuaHRtbCcsXG5cdFx0XHR0eXBlXHQ6ICdnZXQnLFxuXHRcdFx0ZGF0YVR5cGU6ICd0ZXh0Jyxcblx0XHRcdGNhY2hlXHQ6IHRydWUsXG5cdFx0XHRnbG9iYWxcdDogZmFsc2UsXG5cblx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0c2VsZi5idW5kbGUgPSBkYXRhO1xuXHRcdFx0XHRkZWYucmVzb2x2ZSgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0JC53aGVuKGRlZikuZG9uZShjYWxsYmFjayk7XG5cdH0sXHRcdFx0XG5cblx0Ly8gRmV0Y2ggYSB0ZW1wbGF0ZSBmcm9tIHRoZSBjYWNoZWQgYWdncmVnYXRlZCB0ZW1wbGF0ZSBmaWxlLiBcblx0Z2V0VGVtcGxhdGVcdDogZnVuY3Rpb24oaWQpe1xuXHRcdHZhciBhID0gJCh0aGlzLmJ1bmRsZSkuZmluZCgnIycraWQpLmNoaWxkcmVuKCksXG5cdFx0XHRidWYgPSAnJztcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBhLmxlbmd0aDsgaSsrKXtcblx0XHRcdGJ1ZiArPSBhW2ldLm91dGVySFRNTDtcblx0XHR9XG5cdFx0cmV0dXJuIF8udGVtcGxhdGUoYnVmKTtcblx0fVxufTtcblxufSkoKSIsImlmICggdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgKXtcblx0ZXZhbCgndmFyIEJhY2tib25lXHQ9IHJlcXVpcmUoXCJiYWNrYm9uZVwiKTsnICsgXG5cdFx0JyBcdCAgXyA9IHJlcXVpcmUoXCJ1bmRlcnNjb3JlXCIpOycpO1xufVxuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcblx0ZGVmYXVsdHNcdDogXHR7aWRcdFx0XHQ6IG51bGwsXG5cdFx0XHRcdFx0dXNlcm5hbWVcdDogbnVsbCxcblx0XHRcdFx0XHRlbWFpbFx0XHQ6IG51bGwsXG5cdFx0XHRcdFx0Y3JlYXRlZFx0XHQ6IG51bGwsXG5cdFx0XHRcdFx0bGFzdF9jaGFuZ2VcdDogbnVsbCxcblx0XHRcdFx0XHRsYXN0X2xvZ2luXHQ6IG51bGwsXG5cdFx0XHRcdFx0ZmFpbGVkX2xvZ2luX2NvdW50XHQ6IG51bGwsXG5cdFx0XHRcdFx0YXZhdGFyXHRcdDogJy9pbWcvYXZhdGFyLnBuZyd9LFxuXHRcblx0aW5pdGlhbGl6ZVx0OiBmdW5jdGlvbihhdHRyaWJ1dGVzLCBvcHRpb25zKXtcblx0XHRpZiAoIGF0dHJpYnV0ZXMgKSB0aGlzLnNldChhdHRyaWJ1dGVzKTtcblx0XHRfLmV4dGVuZCh0aGlzLCBvcHRpb25zKTtcblx0fSxcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXJcdEhvbWVWaWV3XHQ9IHJlcXVpcmUoJy4vdmlld3MvSG9tZVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Sb3V0ZXIuZXh0ZW5kKHsgXHRcdFxuXHRyb290XHQ6ICcvJywgXG5cdHZpZXdzXHQ6IFtdLCBcblx0Y29uZmlnXHQ6IHt9LFxuXHRyb3V0ZXMgXHQ6IHsgJydcdDogJ2hvbWUnLFxuXHRcdFx0JypvdGhlcic6ICdkZWZhdWx0Um91dGUnIH0sXG5cblx0aW5pdGlhbGl6ZVx0OiBmdW5jdGlvbihvcHRpb25zKXtcblx0XHRfLnRlbXBsYXRlU2V0dGluZ3MgPSB7IGludGVycG9sYXRlIDogL1xce1xceyguKz8pXFx9XFx9L2cgfTtcblx0XHR0aGlzLmNyZWF0ZVZpZXdzKCk7XG5cdFx0dGhpcy5yZW5kZXJWaWV3cygpO1xuXHR9LFxuXG5cdGNyZWF0ZVZpZXdzXHQ6IGZ1bmN0aW9uKCl7XG5cdFx0dGhpcy52aWV3cy5Ib21lVmlldyA9IG5ldyBIb21lVmlldygpO1xuXHR9LFxuXG5cdHJlbmRlclZpZXdzXHQ6IGZ1bmN0aW9uKCl7XG5cdFx0JCgnYm9keScpLmFwcGVuZCh0aGlzLnZpZXdzLkhvbWVWaWV3LnJlbmRlcigpLmVsKTtcblx0XHQvLyB0aGlzLnZpZXdzLndvcmtzcGFjZS5hcHBlbmQoJ2hlYWRlcicsIHRoaXMudmlld3MuaGVhZGVyLnJlbmRlcigpLmVsKTtcblx0fVx0XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGxvYWRlciA9IHJlcXVpcmUoJy4uL2xvYWRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuXHRpZCA6ICdIb21lVmlldycsXG5cblx0Ly8gRGVsZWdhdGluZyBldmVudHMgb25seSB3b3JrIGZvciBkZWxlZ2F0ZS1hYmxlIGV2ZW50czogbm90IGBmb2N1c2AsIGBibHVyYCwgYW5kXG5cdC8vIG5vdCBgY2hhbmdlYCwgYHN1Ym1pdGAsIGFuZCBgcmVzZXRgIGluIEludGVybmV0IEV4cGxvcmVyIChzZWUgYmFja2JvbmUuanMpXG5cdGV2ZW50cyA6IHtcblx0fSxcblxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy50ZW1wbGF0ZSA9IGxvYWRlci5nZXRUZW1wbGF0ZSh0aGlzLmlkKTtcblx0fSxcblxuXHRyZW5kZXIgOiBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0JCh0aGlzLmVsKS5odG1sKHRoaXMudGVtcGxhdGUoKSlcblx0XHRyZXR1cm4gdGhpcztcblx0fSxcbn0pO1xuXG4iXX0=
;