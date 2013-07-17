var util 	= require('util'),
	mysql	= require('mysql');

'use strict';

module.exports = {

	connect: function(express, config){
		this.config = config||{};

		var MySQLStore = require('connect-mysql')(express);

		this.connection = mysql.createConnection(this.config);
		this.connection.on('error', function(err){util.puts(err);});

		this.__fetchConstraints();

		this.config.store = new MySQLStore({client : this.connection});
		return express.session(config);
	},

    getConnection: function(){
        return this.connection;
    },

    minFieldLength: function(fieldname){
    	return this.constraints[fieldname].min;
    },

    maxFieldLength: function(fieldname){
    	return this.constraints[fieldname].max;
    },

	__fetchConstraints: function(){
		var self = this;
		this.constraints = {};

		this.getConnection().query('select * from information_schema.columns where table_schema = "' + 
									this.config.database + '" and table_name = "users"', //' and column_name ="password"',
				function(err, rows, fields){
					if ( err )
						console.log(err);
					else{
						self.constraints.username 	= { min	: 5, max : rows[1].CHARACTER_MAXIMUM_LENGTH };
						self.constraints.email 		= { min	: 3, max : rows[2].CHARACTER_MAXIMUM_LENGTH };
						self.constraints.password 	= { min	: 7, max : rows[3].CHARACTER_MAXIMUM_LENGTH };
					}
			});
    },

    getConfig: function(){
    	return this.config;
    },

	shutdown: function(signal) {
		if ( this.connection ){
			util.puts('closing mysql connection');
			this.connection.end(function(err){ 
				util.puts('error on closing mysql db: ', err);
			});
		}
	}
}

