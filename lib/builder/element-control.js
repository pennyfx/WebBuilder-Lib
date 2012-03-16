var Class = require('shipyard/class/Class'),
	Element = require('shipyard/dom/Element'),
	Control = require('builder/control');

module.exports = new Class({
		Extends: Control,
		type: 'ElementControl',
		options: {
			tag: 'div'
		},
		initialize: function(options, unsafeOptions){			
			this.element = this.element || new Element(this.options.tag, this.options.attributes);	
			this.parent(options, unsafeOptions);			
		},
		append: function(control, where){			
			if (control.element) control.element.inject(this.element, where);
			return this.parent(control);
		}
});