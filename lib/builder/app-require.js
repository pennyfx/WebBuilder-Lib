var Class = require('shipyard/class/Class'),
	sandbox = require('builder/utils/sandbox'),
	Control = require('builder/control'),
	loader = require('builder/resource-loader');	

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
		
		//TODO: replace with a routing mechanism		
		if( path.search('control/') == 0 ){
			
			var parts = path.split('/'),
				controlName = parts[parts.length-1];
			
			var out = {};
			
			// fetch from resource manager
			var control = this.app.controls.find(controlName);
			if(control){
				console.log("loading control:",control);
				var main = loader.loadResource(control.source.path, control.source.sync);
				
				try{
					sandbox.create(main, {
						whitelist: {
							require: this.require.bind(this),
							module: out,
							window: window || {},
							console: console,
						}
					});
					
					var Control = new Class(out.exports);
					Control.addInitializer('controlTreeHook',function(){						
						this._extId = self._extId;
						self.app.controlTree.addControl(this.name, this);
					});
					return Control;
				}catch(e){
					console.log("error creating control",e);
					throw e;
				}
				
			}else{
				throw "Unknown control: " + path;
			}
		}else if (path.search('utils/') == 0){			
			return require('builder/lib/builder/'+path);
		}
		else if (path.search('builder/control') == 0){			
			return require('builder/control');
		}
		else if (path.search('builder/element-control') == 0){			
			return require('builder/element-control');
		}
		else{
			return require(path);
		}
		
	}
	
});
