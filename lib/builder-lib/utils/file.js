
var xulFile = {
	//Asynchronous readdir(3). Reads the contents of a directory. The callback gets two arguments (err, files) where files is an array of the names of the files in the directory excluding '.' and '..'.
	readdir: function(path, callback){
	},
	//Synchronous readdir(3). Returns an array of filenames excluding '.' and '..'.
	readdirSync: function(path){
	},
	readFile: function(filename, encoding, callback){
	},
	readFileSync: function(filename, encoding){		
	}
}

var env = require('./env');
module.exports = env.platform.name == 'node' ? require('fs') : xulFile;
