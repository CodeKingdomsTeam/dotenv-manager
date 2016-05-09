#!/usr/bin/env node

'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var path = require('path');

var pkg = require(path.join(__dirname, 'package.json'));

var parser = new ArgumentParser({
    addHelp: true,
    description: pkg.description,
    version: pkg.version
});

parser.addArgument(['files'], {
    help: 'env files to load configuration from. Least specific first. The configuration will be merged. JS files will be executed where module.exports contains the config',
    nargs: '+'
});

parser.addArgument(['--only'], {
    help: 'If set, will only write the files for one project.',
});

parser.addArgument(['--inline'], {
    help: 'If set, will output the env to stdout instead of files.',
    action: 'storeTrue'
});


var args = parser.parseArgs();

var DotenvManager = require('./index.js');

var manager = new DotenvManager(args.files, args.only, args.inline);
manager.run();
