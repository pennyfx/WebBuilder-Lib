var Class = require('shipyard/class/Class'),
	Object = require('shipyard/utils/object'),
	Options = require('shipyard/class/Options'),
	Env = require('shipyard/env');


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
		console.log("resource-loader.loadResource.error", e, resource_path, type);
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
				data = loadXhr(resource_path);
				break;
			case 'file':
				data = loadDirectoryContents(resource_path);
				break;
		}
		
		return data;
	}catch(e){
		console.log("resource-loader.loadResources.error:", e, resource_path, type);
		throw e;
	}
}



var loadXhr = function( source_path ){
	
	var XHR = function(){
		try { return new XMLHttpRequest(); } catch(e){}
		throw "can't get xhr";
	}
	
	var fetch = function(path){			
		var result = false;
		var xhr = XHR();
		console.log("pulling from ", path);
		xhr.open('GET', path , false);
		xhr.send(null);
		if (xhr.status >= 200 && xhr.status < 300) {
			result = xhr.responseText;
		}
	
		return result;
	};
	return fetch(source_path);
}

var loadResource = function( source_path ){
	
	if(Env.platform.name == 'node'){
		var fs = require('fs');
		var path = require('path');
	}else{
		var fs = require('builder/utils/file');
		var path = require('shipyard/utils/path');
	}	
	source_path = absolutePath(source_path, path);
	
	var f = fs.readFileSync(source_path, 'utf-8');	
	return f;
	
}

var loadDirectoryContents = function(source_path){
	
	if(Env.platform.name == 'node'){
		var fs = require('fs');
		var path = require('path');
	}else{
		var fs = require('builder/utils/file');
		var path = require('shipyard/utils/path');
	}
	source_path = absolutePath(source_path, path);
	
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
					console.log("Error parsing package.json",e, source_path, item);
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

var absolutePath = function(loc, pathfn){
	if(loc.indexOf('/')==0){
		return loc;
	}else{
		return pathfn.join(__dirname, loc);
	}
}