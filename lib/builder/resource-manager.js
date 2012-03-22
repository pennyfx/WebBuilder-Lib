var Class = require('shipyard/class/Class'),
	Object = require('shipyard/utils/object'),
	Array = require('shipyard/utils/array'),
	Options = require('shipyard/class/Options'),
	Loader = require('builder/resource-loader'),
	logger = require('builder/utils/logging');
	
	
module.exports = new Class({
	Implements: Options, // maybe needed later
	
	options:{
		paths: [],
	},
	/*
	 options = 
	 [
		{ path:'http://builder.mozilla.org/project_types' , sync: 'xhr' },
		{ path:'./project_types' , sync: 'file' }
	]
	*/
	initialize: function(options){		
		this.options.paths = options;
		this.resources = {};
		this._loadResources(this.options.paths);
	},
	
	/*
		Finds resources
	*/
	find:	function(resourceKey){
		logger.debug("[resource-manage.find] - find resource", resourceKey);
		return this.resources[resourceKey];
	},
	
	/*
		Gets a resources main file
	*/
	getMain:	function(resourceKey){
		var rez = this.resources[resourceKey],
			main = null;
		
		if(rez){
			main = Loader.loadResource(rez.source.path, rez.source.sync);
		}
		return main;
	},
	
	/*
		Lists all available resources
	*/
	list:	function(){
		return Object.keys(this.resources);
	}, 
	
	/*
		Refreshes the list of resources
	*/
	refresh: function(syncType){
		if(syncType){
			//only one type
			var path = this.options.paths.filter(function(p){
				return (p.type == syncType);
			});
			this._loadResources(path);
		}else{
			//refresh all
			this._loadResources(this.options.paths);
		}
	},
	
	/*
		Load resources from various sources
	*/
	_loadResources: function(resourceLocations){
		var self = this;
		Array.from(resourceLocations).forEach(function(res){			
			self._addResources(res, Loader.loadResources(res.path, res.sync) );
		});
	},
	
	/*
		
	*/
	_addResources: function(source, rez){		
		var self = this;
		if(rez){
			Object.forEach(rez, function(pj, key){
				self.resources[key] = pj;
				self.resources[key].source = Object.clone(source);				
				self.resources[key].source.path += "/" + key + "/" + pj.main;
			});
		}		
	}
});