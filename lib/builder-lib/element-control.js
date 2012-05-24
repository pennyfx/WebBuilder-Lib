var	Control = require('builder-lib/control');
var Element = require('builder-lib/types/element');

module.exports = new Class({
		Extends: Control,
		
		Whitelist: {
			attributes: ['id', 'class', 'styles'],
			properties: []
		},
		
		Accessors: {
			html: {
				get: function(){				
					return this.element.innerHTML;
				},
				set: function(html){				
					this.element.innerHTML = html;
					return this;
				}
			}
		},
		
		type: 'ElementControl',
		
		options: {
			tag: 'div'
		},
		
		initialize: function(unsafeOptions){
			this.parent(unsafeOptions);
		},
		
		setUnsafeOptions: function(unsafeOptions){
			this.parent(unsafeOptions);
			this.attachElement();
			return this;
		},
		
		attachElement: function(){
			this.element = this.element || 
				(this.options.element ? (this.options.element.element || 
					this.options.element).set(this.options.attributes) : 
				new Element(this.options.tag, this.options.attributes));
			this.element.store('control', this); 
			if (this._namespace && !this.namespaced){
				var id = this.element.get('id');
				if (id) this.element.set('id', this._namespace + '-' + id);
				if (this.type) this.element.addClass(this._namespace + '-' + this.type.toLowerCase());
				this.namespaced = true;
			}
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