/*global module:false*/
module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
	});

	var fs = require('fs'),
		pth = require('path');


	grunt.registerTask('default', 'check if the aggregated template file is up to date; create new one if necessary', function(){
		if ( !grunt.file.exists('public/templates')){
			grunt.fail.warn('Cannot create aggregated template file: folder \'public/templates\' not found\n');
			return 1;
		}

		var bundle = 'public/templates/tbundle.html';
		
		// is there is no bundle file, create one
		if ( !grunt.file.exists(bundle) )
 			return grunt.task.run('createBundle');

 		// otherwise check timestamps and create a bundle file is the existing one
 		// is older than at least one of the template files
		var bundletime = fs.statSync(bundle).mtime.getTime(),
		files = grunt.file.expand('public/templates/*'),
		createBundle = false;

		for ( var i=0; i < files.length; i++ ){
			if ( fs.statSync(files[i]).mtime.getTime() > bundletime ){
				createBundle = true;
				break;
			}
		}

		if ( createBundle ) 
			grunt.task.run('createBundle');
	});

	grunt.registerTask('createBundle', 'create aggregated template file', function(){
		var bundle  = 'public/templates/tbundle.html',
			buf     = '<div id="templates">\n',
			files   = grunt.file.expand('public/templates/*');

		for ( var i=0; i < files.length; i++ ){
			// spare the bundle file itself
			if ( files[i] === bundle ) continue;

			var id = files[i].substring(files[i].lastIndexOf('/')+1, files[i].lastIndexOf('.'));
			buf += '<div id="' + id + '">\n';

			var data = fs.readFileSync(files[i], 'utf8');
			buf += data;
			buf += '\n</div> <!-- id="' + id + '" -->\n';
		}

		buf += '</div> <!-- id="templates" -->';
		fs.writeFileSync(bundle, buf, {flag: 'w'});
	});
};
