var logger = require('builder/utils/logging');

module.exports = {
	create: function(fn, options){
		var options = options || {},
			whitelist = options.whitelist || {},
			blacklist = options.blacklist || [],
			keys = [],
			values = [];
		
		for (var key in window){
			keys.push(key);
			values.push(null);
		}
		
		blacklist.forEach(function(key){
			keys.push(key);
			values.push(null);
		});
		
		for (var key in whitelist){
			keys.push(key);
			values.push(whitelist[key]);
		}	
				
		keys.push(fn);
		try{			
			var sandbox = Function.apply(null, keys);
			return sandbox.apply(options.bind || {}, values);
		}catch(e){
			logger.error("sandbox execution error", e);
		}
	}
};