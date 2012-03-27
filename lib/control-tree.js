var Class = require('shipyard/class/Class');

/* 
	ControlTree is in charge of finding, adding and removing controls from the UI 
*/
module.exports = new Class({
	root: null, // root node to document	
	controlRegistry: { named: {} },
	initialize: function(root){
		this.root = root;
		this.controlRegistry.named.root = root;
	},
	findControl: function(name){
		if(this.controlRegistry.named[name]){
			return this.controlRegistry.named[name];
		}else{
			// maybe we should only find explicitly named controls?
			// what about wild cards? selectors?
			// should we just use the DOM for this?
			return this._recursiveFind(name, this.root.children);
		}
	},
	_recursiveFind: function(name, controls){
		var self = this;
		if(controls){
			controls.forEach(function(control){
				if(control.name && control.name == name){
					return control;
				}else if(control.children.length>0){
					return self._recursiveFind(name, control.children);
				}
			});
		}
		return null;
	},
	addControl: function(name, control){
		//named controls go here for fast lookup
		if(name){
			this.controlRegistry.named[name] = control;
		}
		// all controls go here, so we can find and destroy them by extensionid
		// later on
		if(this.controlRegistry[control._extId]){
			this.controlRegistry[control._extId].push(control);
		}else{
			this.controlRegistry[control._extId] = [ control ];
		}
	},
	removeControl:	function(name){		
		var result = false;
		if(name){
			var c = this.controlRegistry.named[name];
			if(c){
				c.destroy();
				result = true;
			}
		}
		return result;
	}
});

