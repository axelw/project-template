var fs			= require('fs'),
	util		= require('util'),
	acm		 	= require('../controller/accountmanager');

module.exports = function(app) {
	// 'use strict';

	app.get('/', function(req, res){
		log('app.get: ', req);
		res.render('index', { title : app.settings.title });
	});

	app.get('/login', function(req, res){
		log('app.get: ', req);
		res.render('index', { title : app.settings.title });
	});

	app.get('/signup', function(req, res){
		log('app.get: ', req);
		res.render('index', { title : app.settings.title });
	});

	app.get('/validate', function (req, res) {
		log('app.get: ', req);
		if ( req.headers['x-requested-with'] !== "XMLHttpRequest" )
			return res.render('404', {title : app.settings.title});

		acm.validate(req.url, function(ret){ 
			res.send(ret);
		});
	});

	// send update information about auth'ed user
	app.get('/cruser', function(req, res){
		log('app.get: ', req);
		if ( req.headers['x-requested-with'] !== "XMLHttpRequest" )
			return res.render('404', {title : app.settings.title});

		acm.findUser({username : req.session.user}, function(model, err){
			res.send(model);
		});
	});

	app.post('/logout', function(req, res){
		log('enter app.post: ', req);
		// res.clearCookie('user');
		// res.clearCookie('pass');
		req.session.destroy(function(e){
			res.send(acm.createUserModel());
			log('leave app.post: ', req);
		});	
	});

	app.post('/signup', function(req, res){
		log('enter app.post: ', req);
		acm.signup({username		: req.param('username'),
					email			: req.param('email'),
					password		: req.param('password'),
					confirm_password: req.param('confirm_password')},
					function(model, ret){
						if ( ret.hasError() ){
							res.send({
								username_errored	: ret.username,
								email_errored		: ret.email,
								password_errored	: ret.password,
								form_errored		: ret.internal ? ret.internal : ''});
						}else{
							req.session.user = model.get('username');
							res.send(model);
							log('leave app.post: ', req);
						}
					});
	});

	app.post('/login', function(req, res){
		log('enter app.post: ', req);
		acm.login({	login		: req.param('login'),
					password	: req.param('password')},
					function(model, ret){
						if ( ret.hasError() ){
							res.send({	login_errored	: ret.login_errored ? ret.login_errored : '',
										form_errored	: ret.internal ? ret.internal : ''});		
						}else{
							req.session.user = model.get('username');
							res.send(model);
							log('leave app.post: ', req);
						}
					});
	});

	app.post('*', function(req, res, next){
		log('app.post * : ', req);
		res.send('app POST *: Not yet implemented');
	});

	app.get('/users/:id', function(req, res, next){
		log('app.get: ', req);
		acm.findUser({username: req.params.id}, function(model, err){
			if ( err.hasError() ) 
				return res.render('500', {title : app.settings.title, error: err.internal});	
			res.send(model);
		});
	});

	app.use(function(req, res, next){
		log('app.use: ', req);
		acm.findUser({username : req.url.slice(1)}, function(model, err){
			if ( model.id )
				return res.render('index', { title : app.settings.title });
			res.render('404', {title : app.settings.title});
		});
	});	
};

function log(s, req){
	console.log(s + ((req)?req.url + ', user: ' + ((req.session)?req.session.user:'undefined'):''));
}
