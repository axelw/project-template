'use strict';

var http		= require('http'),
	fs			= require('fs'),
	util		= require('util'),
	db			= require('./server/db'),	
	express		= require('express'),
	app			= express();

var config = {};

try{
	config = JSON.parse(fs.readFileSync(__filename.substring(0, __filename.lastIndexOf('.')) + '.json', 'utf8'));
}catch(err){
	console.log(err);
	process.exit();
}

app.configure(function () {

	app.set('port', config.nodeport || process.env.PORT || 3000);

	// app.set('strict routing', 'on');
	app.set('views', __dirname + '/server/views');
	app.set('view engine', 'mustache');
	app.engine('mustache', require('mustache-express')());
	app.set('title', config.title);

	// app.use(express.logger('tiny'));  
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.use(express.favicon(__dirname + '/public/img/favicon.ico')); 
	app.use(express.static(__dirname + '/public'));

	// bodyParser:
	// uses json.js to parse 'content-type: application/json'; provide it in req.body
	// uses urlencoded.js to parse 'content-type: application/x-www-form-urlencoded'; provide it in req.body
	// uses multipart.js (which in turn uses f ormidable.js) to parse 'content-type: multipart/form-data' for file uploads; 
	// provide it in req.body and req.files
	app.use(express.bodyParser());

	// cookieParser:
	// must be applied BEFORE db.connect, which sets up the session store
	app.use(express.cookieParser());

	// db:
	// init session store and get db connection
	app.use(db.connect(express, config));

	// methodOverride:
	// utilize simulation of PUT and DELETE (make calls to app.put() and app.del()) via x-http-method-override: PUT (resp. DELETE)
	// and via hidden fields in client code, like <input type="hidden" name="_method" value="put"/> 
	// app.use(express.methodOverride());	

	// app.use(express.csrf());
	app.use(app.router);
});

app.configure('development', function () {
	// empty
});

app.configure('production', function () {
	app.use(express.logger());
	app.use(express.errorHandler());
});

require('./server/routes')(app);


/////////////////////////////////////////////////////////
//  server land

var server = http.createServer(app).listen(app.get('port'));
console.log('server listening on ' + server._connectionKey);

function shutdown(signal) {
	db.shutdown(signal);
	// socket file is removed here
	server.close(); 
	process.exit();
};

process.on('SIGHUP', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
