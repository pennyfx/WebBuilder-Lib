var logging = require('builder-lib/utils/logging.js'),
	helper = require('./utils/helpers');	

helper.bootStrapForNode();

module.exports = {
	
	'Logging should write to console': function(beforeExit, assert){
		var old = process.stdout.write;
		process.stdout.write = function(){
			assert.eql("hello nurse\n", arguments[0]);
			process.stdout.write = old;
		}
		logging.log("hello"	,"nurse");
		
	},
	
	'Logging should write to console with [error] prefix': function(beforeExit, assert){
		var old = process.stdout.write;
		process.stdout.write = function(){
			assert.eql("[error] hello nurse\n", arguments[0]);
			process.stdout.write = old;
		}
		logging.error("hello","nurse");
	},
	
	'Logging should write to console with [debug] prefix': function(beforeExit, assert){
		var old = process.stdout.write;
		process.stdout.write = function(){
			assert.eql("[debug] hello nurse\n", arguments[0]);
			process.stdout.write = old;
		}
		logging.debug("hello","nurse");
	},
	
	'Logging should write to console with [warning] prefix': function(beforeExit, assert){
		var old = process.stdout.write;
		process.stdout.write = function(){
			assert.eql("[warning] hello nurse\n", arguments[0]);
			process.stdout.write = old;
		}
		logging.warning("hello","nurse");
	},
	
	'Logging should return a named logger': function(beforeExit, assert){
		var old = process.stdout.write;
		process.stdout.write = function(){			
			assert.eql("[warning] [tester] hello nurse\n", arguments[0]);
			process.stdout.write = old;
		}
		logging.getLogger('tester').warning("hello","nurse");
	},
	
	
}