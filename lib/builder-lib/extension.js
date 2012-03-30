var Class = require('shipyard/class/Class'),
	Model = require('shipyard/model/Model'),
	WebSync = require('shipyard/sync/Browser'),
	sandbox = require('./utils/sandbox'),
	AppRequire = require('./app-require'),
	loader = require('./resource-loader').loadResource,
	logger = require('./utils/logging');

	
module.exports = new Class({
	
	package_json: {}, //package.json data
	id: null,
	options: {
	
	},
	
	initialize:	function(ide, packageJson){		
		this.id = '';//generateNewId();
		this.package_json = packageJson;
		
		var out = {};
		// special app.require()   or we can swap it with a plain ole require
	
		var key = "extension-" + this.package_json.name.slugify();	
		
		logger.debug("extension key: ", key);
		
		var ar = new AppRequire(ide, {
			extensionID: key,
			package_json: this.package_json
		});	
		
		try{
			
			var main = loader(this.package_json.source.path, this.package_json.source.sync);
			sandbox.create(main, {
				blacklist: ['XMLHttpRequest', 'window'],
				whitelist: {
					require: function(n){ logger.debug('[extension.initialize] - app.require', n); return ar.require(n); },
					module: out,
					console: logger.getLogger(key),
					app: { controlTree: ide.controlTree, projectType: ide.getCurrentCollection() }
				}
			});
			
		} catch(ex){
			var msg = "[extension.initialize] - Failed to init extension:";
			logger.error(msg, ex);
			throw msg;
		}
		
		this.source = out.exports;
		//logger.debug(out);
		//this._initContextRequires(options.ContextRequires, ide);
	},
	
	load: function(){
		console.log("load this extension",this);
		if(this.source && this.source.onLoad){
			this.source.onLoad.call(this);
		}else{
			throw "'load' Not implemented";
		}
	},
	
	unload: function(){
		if(this.source && this.source.onUnload){
			this.source.onUnload.call(this);
		}else{
			throw "'unload' Not implemented";
		}
		
	}
	
});