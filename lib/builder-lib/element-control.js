var Class = require('shipyard/class/Class'),
	DOM = require('shipyard/dom'),
	Control = require('./control');

module.exports = new Class({
		Extends: Control,
		Whitelist: {
			attributes: ['id'],
			properties: ['name']
		},
		type: 'ElementControl',
		options: {
			tag: 'div'
		},
		initialize: function(unsafeOptions){
			this.setOptions(unsafeOptions);
			this.parent(this.options);
			this.element = this.element || this.options.element || new DOM.Element(this.options.tag, this.options.attributes);
			this.element.store('control', this);
		},
		append: function(controls, where){			
			Array.from(controls).each(function(control){
				if (control.element) control.element.inject(this.element, where);
			}, this);
			return this.parent(controls);
		},
		inject: function(control, where){
			if (control.element) this.element.inject(control.element, where);
			return this.parent(control);
		}
});