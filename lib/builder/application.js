	

var Class = require('shipyard/class/Class'),
	Options = require('shipyard/class/Options'),	
	ControlTree = require('builder/control-tree'),
	Extension = require('builder/extension'),
	ResourceManager = require('builder/resource-manager'),	
	logger = require('builder/utils/logging');


module.exports = new Class({
	Implements: [Options],
	
	options:{
		root: null, // html ? body? some other control container		
		bootstrapExtension: null,
		currentCollection: null,
	},
	
	initialize:	function(options){

		this.setOptions(options);
		
		if (this.options.root) {
			this.controlTree = new ControlTree(this.options.root);
		}else throw "Please provide a root node";
		
		if(options.resources){
			this.controls = new ResourceManager(options.resources.controls);
			this.extensions = new ResourceManager(options.resources.extensions);
			this.collections = new ResourceManager(options.resources.collections); //aka project_types
			this.skins = new ResourceManager(options.resources.skins);
		}
		this.activeExtensions = {};
		
		if (this.options.bootstrapExtension){
			this._loadExtensions([this.options.bootstrapExtension]);
		}
	},
	
	loadCollection: function(name){
		var self = this;
		//unload current extensions ?
		self.unloadCollection();
		
		// pull the package type
		// look at dependencies
		// create a list of all the extensions needed to load in order
		var extensions = [],
			packageJson = this.collections.getMain(name);
			
		var getExtensions = function(pkg){
			pkg = JSON.parse(pkg);
			if(pkg){		
				if(pkg.extensions){					
					pkg.extensions.reverse().forEach(function(ext){
						extensions.unshift(ext)	
					});
				}
				
				if(pkg.depends){
					packageJson = self.collections.getMain(pkg.depends);
					getExtensions(packageJson);
				}
			}
		}		
		getExtensions(packageJson);
		logger.debug("[Application.loadCollection] - Loading extensions for collection:", name, extensions);
		this.options.currentCollection = name;
		this._loadExtensions(extensions);		
	},
	
	
	unloadCollection: function(){		
		this._unloadAllExtensions();
		this.options.currentCollection = null;
	},
	
	loadExtension: function(name){
		this._loadExtensions([name]);
	},
	
	unloadExtension: function(name){
		if(this.activeExtensions[name]){
			this.activeExtensions[name].unload();
			delete self.activeExtensions[name];
		}
	},
	
	getCurrentCollection: function(){
		return this.options.currentCollection;
	},
	
	_loadExtensions: function(extensions){
		var self = this;
		extensions.forEach(function(extension){
			try{
				
				var packageJson = self.extensions.find(extension);
				
				logger.debug("[Application._loadExtensions] - loading extension", extension, packageJson);
				
				// build sandbox
				// pass sandboxed self with options
				// options should include any global flags that extension authors need for business logic				
				var ext = new Extension(self, packageJson);
				self.activeExtensions[extension] = ext;			
				ext.load();
			}catch(e){
				logger.error("[Application._loadExtensions] - error loading extension",
							extension, e);
				throw e;
			}
		});
		logger.debug("[Application._loadExtensions] - completed loading extensions", Object.keys(self.activeExtensions));
	},
	_unloadAllExtensions: function(){
		var self = this;
		Object.each(self.activeExtensions, function(item, key){
			logger.debug("[Application._unloadAllExtensions] - unloading extension:", key);
			item.unload();
			delete self.activeExtensions[key];
		});
	}
	
});