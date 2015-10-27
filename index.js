'use strict';
/* jshint esnext: true */

var _ = require( 'lodash' );
var fs = require( 'fs' );
var path = require( 'path' );

var DotenvManager = function( files ) {

	this.files = files;
};


DotenvManager.prototype = {

	run: function() {

		var results = {};

		_.each( this.files, ( file ) => {

			var fileResults = require( path.join( process.cwd(), file ) );

			results = _.merge( results, fileResults );

		} );

		_.each( results, ( env, project ) => {

			if ( project === 'global' ) return;

			this._writeEnvForProject( project, _.merge( {}, results.global, env ) );

		} );
	},

	_writeEnvForProject: function( project, env ) {

		if ( fs.statSync( project ).isDirectory() ) {

			var outPath = path.join( project, '.env' );

			console.log( 'Writing', outPath );

			fs.writeFileSync( outPath, _.map( env, ( val, key ) => {

				return key + '=' + val;

			} ).join( '\n' ) );
		} else {

			throw new Error( project + ' is not a directory' );
		}
	}
};

module.exports = DotenvManager;