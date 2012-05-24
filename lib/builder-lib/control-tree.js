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
	getControl: function(id){
		return this.controlRegistry.named[id];
	},
	findControls: function(key, value){
		return this._recursiveFind(key, value, this.root.children);
	},
	_recursiveFind: function(key, value, array){
		var returns = [],
			controlLoop = function(controls){
				Array.from(controls).each(function(control){
					if (control[key] == value) returns.push(control);
					else if (control.children.length) controlLoop(key, value, control.children);
				}, this);
			}
		controlLoop(array); 
		return returns;
	},
	
	register: function(control){
		// all controls go here, so we can find and destroy them by extensionid later on
		var controls = this.controlRegistry[control._extId];
		this.controlRegistry[control._extId] = (controls || []).include(control);
	},
	
	unregister: function(){
	
	},
	
	addControl: function(name, control){
		if (typeof control._namespace == 'string') {
			if (name){
				name = control._namespace + '-' + name;
				if (this.controlRegistry.named[name]) throw "There is already a control registered with the name: " + name;
				this.controlRegistry.named[name] = control;
			}
			else throw "A control name is required for addition of this control to the global namespace:" + control._extId;
		}
		else throw "You have not specified a namespace for your globally accessible controls in this extension's package.json file: " + control._extId;
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

