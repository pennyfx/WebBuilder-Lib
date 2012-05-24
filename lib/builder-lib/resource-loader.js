var	logger = require('./utils/logging'),
	Env = require('./utils/env'),
	path = require('./utils/path'), 
	fs = require('./utils/file');

/* 
	Expects a specific file to load 
*/
module.exports.loadResource = function(resource_path, type){
	
	try{		
		var data = null;
		switch(type){
			case 'xhr':			
				data = loadXhr(resource_path);
				break;
			case 'file':
				data = loadResource(resource_path);
				break;
		}
		
		return data;
	}catch(e){
		logger.error("resource-loader.loadResource", e, resource_path, type);
		throw e;
	}
}


/*
	Expects a path not a file 
*/
module.exports.loadResources = function(resource_path, type){
	
	try{		
		var data = null;
		switch(type){
			case 'xhr':			
				data = loadXhr(resource_path, true);
				break;
			case 'file':
				data = loadDirectoryContents(resource_path);
				break;
		}
		
		return data;
	}catch(e){
		logger.error("resource-loader.loadResources.error:", e, resource_path, type);
		throw e;
	}
}

var _cache = {};

var loadXhr = function( source_path, isJson ){
	
	var XHR = function(){
		try { return new XMLHttpRequest(); } catch(e){}
		throw "can't get xhr";
	}
	
	

	var fetch = function(path){			
		var result = false;
		var xhr = XHR();
		logger.debug("[resource-loader.loadXhr] pulling from ", path);
		xhr.open('GET', path , false);
		xhr.send(null);
		if (xhr.status >= 200 && xhr.status < 300) {
			result = xhr.responseText;
		}
		
		if(isJson){
			try{
			result = JSON.parse(result)
			}catch(e){
				logger.error("can't parse 'json'",e);
			}
		}
	
		return result;
	};

	if(!_cache[source_path])
		_cache[source_path] = fetch(source_path);
	return _cache[source_path];

}

var loadResource = function( source_path ){
	source_path = absolutePath(source_path);
	var f = fs.readFileSync(source_path, 'utf-8');	
	return f;
	
}

var loadDirectoryContents = function(source_path){
	
	source_path = absolutePath(source_path);
	
	var results = {}, 
		contents = fs.readdirSync(source_path);
	
	Object.forEach(contents, function(item){
			var dirCont = fs.readdirSync(path.join(source_path, item));			
			if(~dirCont.indexOf('package.json')){
				try{
					var pj = JSON.parse(
							fs.readFileSync(
								path.join(source_path, item,'package.json'),
									'utf-8'));
				}catch(e){
					logger.error("Error parsing package.json",e, source_path, item);
				}
				results[item] = {
					main: (pj && pj.main) ? pj.main :'package.json',
					name: item
				};
				
			}else if (~dirCont.indexOf('index.js')){				
				results[item] = {
					main: 'index.js',
					name: item
				}
			}
	});
		
	return results;
	
}

var absolutePath = function(loc){
	if(loc.indexOf('/')==0){
		return loc;
	}else{
		logger.log("absolutePath fn");
		return path.join(__dirname, loc);
	}
}