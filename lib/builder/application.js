	

var Class = require('shipyard/class/Class'),
	Options = require('shipyard/class/Options'),
	object = require('shipyard/utils/object'),
	ControlTree = require('builder/control-tree'),
	Extension = require('builder/extension'),
	ResourceManager = require('builder/resource-manager'),	
	logger = require('builder/utils/console');


module.exports = new Class({
	Implements: [Options],
	
	options:{
		root: null, // html ? body? some other control container		
		bootstrapExtension: null,
		currentProject: null,
	},
	
	initialize:	function(options){

		this.setOptions(options);
		
		if (this.options.root) {
			this.controlTree = new ControlTree(this.options.root);
		}else throw "Please provide a root node";
		
		if(options.resources){
			this.controls = new ResourceManager(options.resources.controls);
			this.extensions = new ResourceManager(options.resources.extensions);
			this.collections = new ResourceManager(options.resources.collections);
			this.skins = new ResourceManager(options.resources.skins);
		}
		this.activeExtensions = {};
		
		if (this.options.bootstrapExtension){
			this._loadExtensions([this.options.bootstrapExtension]);
		}
	},
	
	loadCollection: function(name){		
		// pull the package type
		// look at dependencies
		// create a list of all the extensions needed to load in order
		var extensions = [],
			collection = this.collections.find(name);
			
		var getExtensions = function(pkg){
			if(pkg){
				pkg.extensions.reverse().forEach(function(ext){
					extensions.unshift(ext)	
				});
				
				if(pkg.depends){
					collection = this.collections.find(pkg.depends);
					getExtensions(collection);
				}
			}
		}
		getExtensions(collection);
		this._loadExtensions(extensions);
	},
	
	
	unloadCollection: function(){
		this._unloadAllExtensions();
	},
	
	
	_loadExtensions: function(extensions){
		var self = this;
		extensions.forEach(function(extension){
			
			var packageJson = self.extensions.find(extension);
			
			// build sandbox
			// pass sandboxed self with options
			// options should include any global flags that extension authors need for business logic
			
			var ext = new Extension(self, packageJson);
			self.activeExtensions[extension] = ext;
			try{
				ext.load();
			}catch(e){
				console.log("application._loadExtensions: error loading extension",
							extension, e);
				throw e;
			}
		});
		console.log("completed loading extensions", Object.keys(self.activeExtensions));
	},
	_unloadAllExtensions: function(){
		var self = this;
		object.each(self.activeExtensions, function(item, key){
			item.unload();
			delete self.activeExtensions[key];
		});
	}
	
});