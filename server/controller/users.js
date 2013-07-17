module.exports = function(app) {
	'use strict';

	// list all users
	app.get('/users', function(req, res){
		res.send('GET /users - not yet implemented');
	});

	// create a user via registration form
	app.post('/users/', function(req, res, next){
		res.send('GET /users - not yet implemented');
	});
 
	// read a user
	app.get('/users/:id', function(req, res){
		res.send('GET /users/:id - not yet implemented');
	});

	// update a user
	app.put('/users/:id', function(req, res){
		res.send('PUT /users/:id - not yet implemented');		
	});

	// update a user
	app.del('/users/:id', function(req, res){
		res.send('DEL /users/:id - not yet implemented');		
	});
}
