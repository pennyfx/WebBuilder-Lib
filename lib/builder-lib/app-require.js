var	loader = require('./resource-loader'),
	sandbox = require('./utils/sandbox'),
	logger = require('./utils/logging');

module.exports = new Class({
	
	Implements: [Options],
	
	options:{
		extensionID: null,
		package_json: {},
		routes:{
			'control/' : ''
		}
	},
	initialize: function(app, options){
		this.setOptions(options);
		this.app = app;
		this._extId = this.options.extensionID;
	},
	require: function(path){
		var self = this;
		//console.log("[app-require] - requiring", path);
		logger.debug("[app-require] - requiring", path);
		//TODO: replace with a routing mechanism		
		if ( path.search('control/') == 0 ){
			
			var parts = path.split('/'),
				controlName = parts[parts.length-1];
			
			var out = {};
			
			// fetch from resource manager
			var control = this.app.controls.find(controlName);
			if(control){
				
				var main = loader.loadResource(control.source.path, control.source.sync);
				
				try{
					sandbox.create(main, {
						whitelist: {
							require: this.require.bind(this),
							module: out,
							window: window || {},
							console: logger.getLogger(path),
						}
					});
					
					var Control = new Class(out.exports);
					self._addInitializer(Control);
					return Control;
				}catch(e){
					logger.error("error creating control",e);
					throw e;
				}
				
			} else {
				throw "Unknown control: " + path;
			}
		} 
		else if ( path.search('utils/') == 0 ){			
			return require('builder-lib/utils/'+path);
		} 
		else if ( path.search('builder-lib/control') == 0 ){		
			var Control = require('builder-lib/control');
			self._addInitializer(Control);
			return Control;
		}
		else if ( path.search('builder-lib/element-control') == 0 ){			
			var Control = require('builder-lib/element-control');
			self._addInitializer(Control);
			return Control;
		}
		else{
			return require(path);
		}
		
	},
	_addInitializer: function(control){
		var self = this;
		control.addInitializer('controlTreeHook', function(){						
			this._extId = self._extId;
			this._namespace = self.options.package_json.namespace;
			self.app.controlTree.register(this);
		});
		return this;
	}
	
});
