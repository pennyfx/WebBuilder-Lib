console.log("adfad");
var Class = require('shipyard/class/Class'),
	Model = require('shipyard/model/Model'),
	WebSync = require('shipyard/sync/Browser'),
	sandbox = require('builder/utils/sandbox'),
	AppRequire = require('builder/app-require'),
	loader = require('builder/resource-loader').load;

	
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
		
	
		var key = "extension-" + packageJson.name.slugify();
		
		var ar = new AppRequire(ide, key);		
		try{
			
			var main = loader(this.package_json.source.path, this.package_json.source.sync);
			sandbox.create(main, {
				blacklist: ['XMLHttpRequest', 'window'],
				whitelist: {
					require: function(n){ console.log('app.require', n); return ar.require(n); },
					module: out,
					console: console,
					app: { controlTree: ide.controlTree }
				}
			});
			
		} catch(ex){
			var msg = "Failed to init extension:";
			console.log(msg, ex);
			throw msg;
		}
		
		this.source = out.exports;
		console.log(out);
		//this._initContextRequires(options.ContextRequires, ide);
		
	},
	
	load: function(){
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
		
	},
	
	/*_initContextRequires: function(requires, ide){
		if(requires){
			if ( requires.indexOf('Storage')>-1 ){
				//var id = MD5Hash(this.package_json.name);
				this.storage = new Storage(id);
			}
			if ( requires.indexOf('ControlTree')>-1 ){
				this.controlTree = ide.controlTree;
			}
		}
	}*/
	
});