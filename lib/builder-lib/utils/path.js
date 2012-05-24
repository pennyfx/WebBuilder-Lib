var xulPath = {
	
}

var env = require('./env');
module.exports = env.platform.name == 'node' ? require('path') : xulPath;
