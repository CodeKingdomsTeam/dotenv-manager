'use strict';
/* jshint esnext: true */

var _ = require( 'lodash' );
var fs = require( 'fs' );
var path = require( 'path' );

var DotenvManager = function( files, writeJson ) {

	this.files = files;
	this.writeJson = writeJson;
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

			if ( this.writeJson ) {

				outPath = path.join( project, '.env.json' );

				console.log( 'Writing', outPath );

				fs.writeFileSync( outPath, JSON.stringify( env, null, 2 ) );
			}
		} else {

			console.warn( project + ' is not a directory' );
		}
	}
};

module.exports = DotenvManager;
