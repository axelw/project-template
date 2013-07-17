'use strict';	

module.exports = {
	// Objs of this type are used during registration and logon. If username, email and/or
	// password are missing where they are expected, if they are invalid or cannot be found, the 
	// container gets an attribute under the respective name, that holds the textual description 
	// of the error.
	// If an internal error is encountered, eg. database failure, an attribute internal is created
	// that holds the description of the internal error. If a generic error shows up, an attribute 
	// error is created, which holds a description of what happened. TODO: probably merge both cases.
	//
	// Currently, only string values can be used. Setting a boolean attribute for example would lead
	// to errors, because it is skipped by the lengh check (one more reason to abolish that)
	defaultResult : function(){
		var r = {};
		r.hasError = function(){
			for (var prop in this){
				// TODO: most probably, the length check should be abolished.
				// But not before thorough test suites have been set up.
				if (prop !== "hasError" && this[prop].length > 0 )
					return true;
			}
			return false;
		};
		return r;
	},

	merge : function(a, b) {
		if ( !a ) return b; 
		if ( !b ) return a;

		for (var prop in b){
			if ( a.hasOwnProperty(prop) ){
				// this is special and experimental: 
				// concatenate contents with newline. To show several internal errors at once 
				if ( typeof prop === 'string'  )
					a[prop] += '\n' + b[prop];
				continue;	
			} 
			a[prop] = b[prop];	
		}
		return a;
	}
}

