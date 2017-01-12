'use strict';
/* jshint esnext: true */

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var DotenvManager = function(files, only, inline) {

    this.files = files;
    this.only = only;
    this.inline = inline;
};


DotenvManager.prototype = {

    run: function() {

        var results = {};

        _.each(this.files, (file) => {

            var fileResults = require(path.isAbsolute(file) ? file : path.join(process.cwd(), file));

            results = _.merge(results, fileResults);

        });

        _.each(results, (env, project) => {

            if (project === 'global') return;

            if (this.only && project !== this.only) {

                return;
            }

            const mergedEnv = _.merge({}, results.global, env);

            if (this.inline) {

                process.stdout.write(_.map(env, (val, key) => {

                    return `${key}=${val}`;

                }).join(' '));
            } else {

                this._writeEnvForProject(project, mergedEnv);
            }

        });
    },

    _writeEnvForProject: function(project, env) {

        try {

            fs.statSync(project).isDirectory();

        } catch (e) {

            console.warn(project + ' is not a directory', e);

            return;
        }

        var outPath = path.join(project, '.env');

        console.log('Writing', outPath);

        fs.writeFileSync(outPath, _.map(env, (val, key) => {

            return key + '=' + (_.isObject(val) ? JSON.stringify(val) : val);

        }).join('\n'));

        outPath = path.join(project, '.env.json');

        console.log('Writing', outPath);

        fs.writeFileSync(outPath, JSON.stringify(env, null, 2));

    }
};

module.exports = DotenvManager;
