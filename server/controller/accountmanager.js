var util		= require('util'),
	url			= require('url'),
	crypto		= require('crypto'),
	moment 		= require('moment'),
	db			= require('../db'),
	UserModel	= require('../models/UserModel'),
	lib			= require('../lib'),
	_			= require('underscore')._;


'use strict';

module.exports = {

	signup: function(data, callback){
		var model = new UserModel(),
			self = this;

		this.validate(data, function(ret){
			if ( ret.hasError() )
				callback(model, ret);
			else{
				createSaltedHash(data.password, function(hashedPassword){
					var clearTextPassword = data.password;
					
					data.password = hashedPassword;
					data.created = moment().format('YYYY-MM-DD HH:mm:ss Z');
					delete data.confirm_password;
					delete data.denyEmpty;

					db.getConnection().query('insert into ' + db.getConfig().database + '.users SET ?', data, 
						function(err, result){
							if ( err ){
								util.log(err);
								ret.internal = err.toString();
								callback(model, ret);
							}
							else self.login({login: data.username, password: clearTextPassword}, function(model, ret){
								callback(model, ret);
						})
					});
				})
			}
		});	
	},

	login: function(data, callback){
		var ret 	= lib.defaultResult();
			model 	= new UserModel();

		if ( !data.login || !data.password){
			ret.login_errored = message.login_errored;
			callback(model, ret);
		}

		db.getConnection().query('select * from ' + db.getConfig().database + '.users ' +
								'where username = ? or email = ?', [data.login, data.login], 
			function(err, result){
				if ( err ){
					util.log(err);
					ret.internal = err.toString();
				}
				else if ( result.length == 0 )
					ret.login_errored = message.login_errored;
				else if ( !verifyPassword(data.password, result[0].password) )
					ret.login_errored = message.login_errored;

				if ( !ret.hasError() ){
					var last_login = moment().format('YYYY-MM-DD HH:mm:ss Z');

					model.set(_.omit(result[0], 'password', '_typecast', 'parse'));
					model.set('last_login', last_login);

					// write statistics
					db.getConnection().query('update ' + db.getConfig().database + '.users ' +
											'set last_login = ?, login_count = login_count + 1 ' +
											'where username = ? or email = ?', [last_login, data.login, data.login], 

											function(err, result){
												if ( err ){
													util.log(err);
													ret.internal = err.toString();
												}
												callback(model, ret);
											});
				} else {
					db.getConnection().query('update ' + db.getConfig().database + '.users ' +
											'set failed_login_count = failed_login_count + 1 ' +
											'where username = ? or email = ?', [data.login, data.login], 
											function(err, result){
												if ( err ){
													util.log(err);
													ret.internal = err.toString();
												}
												callback(model, ret);
											});
				}
			});		
	},

	findUser: function(data, callback){
		var ret 	= lib.defaultResult(),
			model 	= new UserModel();

		db.getConnection().query('select * from ' + db.getConfig().database + '.users' +
								' where ?', [data], function(err, result){
			if ( err ) {
				ret.internal = err.toString();
				util.log(ret.internal);
				return callback(model, ret);
			}

			if ( result.length === 0 ) 
				return callback(model, ret);

			// though this should never happen ...
			if ( result.length > 1 )
				util.log('Excessive results; total ' + result.length);
		
			model.set(_.omit(result[0], 'password', '_typecast', 'parse'));
			return callback(model, ret);
		});
	},

	createUserModel	: function(){
		return new UserModel();
	},

	render: function(req, callback){
		this.existsIn('users', { username : req.url.slice(1)}, function(ret){
			if ( ret.hasError() )
				return callback(ret);

			return req.res.send({ok	: true});

			// a user of that name exists, now display the public profile.
			// req.res.render('user', {title	: 'Registrierung' ,
			// 						login	: navBar.render('login', req.session.user),
			// 						logout	: navBar.render('logout', req.session.user),
			// 						message : 'public personalized page for user ' + req.url.slice(1) + ' goes here. Visitor is: ' + req.session.user});


			// We have an auth'ed user, so we display the appropriate navBar. 
			// Next thing to do is to design a public and a private user profile, the latter
			// only accessible to th user in question here if this user is the one this page belongs to.


			// req.res.send('personalized page for user ' + req.url.slice(1) + ' goes here.\nVisitor: ' + req.session.user);
		});
			// if so. navigates to /<username>: 
			// 	* show public user page
			// 	* If <username> is logged in, navbar should display 'logout' and access to private account settings
			// 	* is so. else is logged in, navbar should display 'logout'
			// 	* if nobody is logged in, navbar should display 'Anmelden'

			// if ( req.session.user ){
			// 	userman.existsIn('users', { username: req.session.user }, function(ret){
			// 		util.log('found sth.');
			// 	})
			// }
		// callback(lib.defaultResult());
	},

	validate: function(data, callback){
		var result = lib.defaultResult(),
			self = this;

		if ( typeof data == 'string' ){
			// ajax validation request
			var query = url.parse(data, true).query;
			if ( query.username !== undefined ){
				validateUsername(query, function(ret){
					callback(lib.merge(result, ret));
				});
			}
			if ( query.email !== undefined  ){
				validateEmail(query, function(ret){
					callback(lib.merge(result, ret));
				});
			}
			if ( query.password !== undefined ){
				validatePassword(query, function(ret){
					callback(lib.merge(result, ret));
				});
			}
		}
		else{
			// account validation
			data.denyEmpty = true;
			validateUsername(data, function(ret){
				lib.merge(result, ret);

				validateEmail(data, function(ret){
					lib.merge(result, ret);

					validatePassword(data, function(ret){
						callback(lib.merge(result, ret));
					});
				});
			});
		}
	}
}

var createSaltedHash = function(password, callback){
	var salt = makeSalt();
	callback(salt + sha256(password + salt));
}

var makeSalt = function(){
	var base	= 'ABCDEFGHIJKLMNOPQURSTUVWXYZabcdefghijklmnopqurstuvwxyz0123456789';
	var salt	= '';
	for ( var i = 0; i < 10; i++ ) {
		var p = Math.floor(Math.random() * base.length);
		salt += base[p];
	}
	return salt;	
}

var sha256 = function(data){
	return crypto
			.createHash('sha256')
			.update(data)
			.digest('hex');
}

var verifyPassword = function(password, hashedPassword)
{
	var salt = hashedPassword.substr(0, 10);
	var validHash = salt + sha256(password + salt);
	return (hashedPassword === validHash);
}

var validateUsername = function(query, callback){
	if ( query.denyEmpty || query.username.length > 0 ){
		if ( query.username.length === 0 || 
			query.username.match(pattern.username) ||
			reserved.filter(function(name){ return name.toLowerCase() === query.username.toLowerCase() }).length > 0 ){
				return callback({username: message.username_invalid});
		}

		console.log('TODO: enable username check');
		// if ( query.username.length < db.minFieldLength('username') )
		// 	return callback({username: util.format(message.username_too_short, db.minFieldLength('username'))});
		// if ( query.username.length > db.maxFieldLength('username') )
		// 	return callback({username: util.format(message.username_too_long, db.maxFieldLength('username'))});
	}

	db.getConnection().query('select * from users where username = ?', [query.username], function(err, rows, fields){
		if ( err ) {
			util.log(err);
			return callback({internal: err.toString()});
		}
		if ( rows.length > 0 ) 
			return callback({username: message.username_taken});
		
		return callback();
	});
};

var validateEmail = function(query, callback) {
	if ( query.denyEmpty || query.email.length > 0 ){
		if ( !query.email.match(pattern.email)){
			return callback({email: message.email_invalid});
		}
		if ( query.email.length > db.maxFieldLength('email') )
			return callback({email: util.format(message.email_too_long, db.maxFieldLength('email'))});
		// do not check for min length here
	}

	db.getConnection().query('select * from users where email = ?', [query.email], function(err, rows, fields){
		if ( err ) {
			util.log(err);
			return callback({internal: err.toString()});
		}
		if ( rows.length > 0 )
			return callback({email: message.email_taken});
		
		return callback();
	});
};

var validatePassword = function(query, callback){

	util.log('TODO: enable password check');

	if ( query.denyEmpty || query.password.length > 0 ){
		if ( query.password.length == 0 )	
			return callback({password: message.password_empty});

		
		// if ( query.password.length > db.maxFieldLength('password') )
		// 	return callback({password: util.format(message.password_too_long, db.maxFieldLength('password'))});
		// if ( query.password.length < db.minFieldLength('password') )
		// 	return callback({password: util.format(message.password_too_short, db.minFieldLength('password'))});
		// var m = regExPwd(query.password);
		// if ( m )
		//  	return callback({password: m});
		

		if ( query.denyEmpty || (!query.DenyEmpty && query.confirm_password)){
			if ( query.password !== query.confirm_password )
				return callback({password: message.password_mismatch});
		} 
	}
	callback();
};

var regExPwd = function(password){
	// For clarity, the regex is broken into parts.
	// Kidding. I was just not able to make it a one-liner (including min/max length)

	// must contain at least one digit
	if ( !password.match(/.*\d.*/) )	
		return message.password_tokens;
	// must contain at least one uppercase char
	if ( !password.match(/.*[A-Z].*/) )
		return message.password_tokens;
	// must contain at least one lowercase char
	if ( !password.match(/.*[a-z].*/) )
		return message.password_tokens;
	// must contain at least one special char
	if ( !password.match(/.*[-!”#$%&’()*+,.\/;:=?_@<>(){}].*/) )
		return message.password_tokens;
	// must not contain other chars than one of these. Probably we could allow all of utf-8
	if ( password.match(pattern.password) )
		return message.password_invalid;
	return '';
};

var pattern = {
	// apart from :alnum:, basically Latin-1 Supplement and Latin Extended-A, with few exceptions like '§''
	username	: /[^\w\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u017F-.]/,
	password	: /[^\w\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u017F-!#$%&+*,.\/;:=?_@<>(){}]/,
	email		: /.@./	
},

message = {
	username_invalid	: 'Der Benutzername ist ungültig oder bereits vergeben. Es können alle Groß- und Kleinbuchstaben verwendet werden sowie Ziffern, Punkt und Bindestrich',
	username_taken		: 'Der Benutzername ist ungültig oder bereits vergeben. Es können alle Groß- und Kleinbuchstaben verwendet werden sowie Ziffern, Punkt und Bindestrich',
	username_too_long	: 'Der Benutzername ist zu lang. Erlaubt sind %d Zeichen',
	username_too_short	: 'Der Benutzername ist muss mindestens %d Zeichen lang sein',
	email_invalid		: 'Die Email ist ungültig oder bereits vergeben',
	email_taken			: 'Die Email ist ungültig oder bereits vergeben',
	email_too_long		: 'Die Email ist zu lang. Erlaubt sind %d Zeichen',
	password_invalid	: 'Das Passwort enthält ungültige Zeichen.',
	password_empty		: 'Es muss ein Passwort angegeben werden',
	password_mismatch	: 'Die Passworte stimmen nicht überein',
	password_too_long	: 'Das Passwort ist zu lang. Erlaubt sind %d Zeichen', 
	password_too_short	: 'Das Passwort muss mindestens %d Zeichen lang sein',
	password_tokens		: 'Das Passwort muss jeweils mindestens einen Groß- und einen Kleinbuchstaben, eine Ziffer und eines der folgenden Sonderzeichen enthalten:  -!#$%&+*,./;:=?_@<>(){}',
	login_errored		: 'Benutzername oder Passwort ist ungültig',
	form_errored		: 'Es gab ein Problem beim Anlegen Ihres Zugangs',
	internal_error		: 'Interner Fehler: '
},

reserved = ['admin', 'login', 'logout', 'validate', 'signup', 'cruser'];
