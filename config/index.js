'use strict';

var getConfig = function() {
	const env = process.env.NODE_ENV || 'development',
    confObj = require('./'+env+'.json')
	return confObj;
}

module.exports = getConfig();

