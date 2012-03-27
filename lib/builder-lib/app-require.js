var Class = require('shipyard/class/Class'),
	sandbox = require('./utils/sandbox'),
	Control = require('./control'),
	loader = require('./resource-loader'),
	logger = require('./utils/logging');

module.exports = new Class({
	
	options:{
		routes:{
			'control/' : ''
		}
	},
	initialize: function(app, extid){
		this.app = app;
		this._extId = extid;
	},
	require: function(path){
		var self = this;
		//console.log("[app-require] - requiring", path);
		logger.debug("[app-require] - requiring", path);
		//TODO: replace with a routing mechanism		
		if( path.search('control/') == 0 ){
			
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
					Control.addInitializer('controlTreeHook',function(){						
						this._extId = self._extId;
						self.app.controlTree.addControl(this.name, this);
					});
					return Control;
				}catch(e){
					logger.error("error creating control",e);
					throw e;
				}
				
			}else{
				throw "Unknown control: " + path;
			}
		}else if (path.search('utils/') == 0){			
			return require('./'+path);
		}
		else if (path.search('builder/control') == 0){			
			return require('./control');
		}
		else if (path.search('builder/element-control') == 0){			
			return require('./element-control');
		}
		else{
			return require(path);
		}
		
	}
	
});
