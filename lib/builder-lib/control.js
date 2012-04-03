var Class = require('shipyard/class/Class'),
	Events = require('shipyard/class/Events'),
	Plugin = require('builder-lib/utils/plugin');

//var EventsPlugin = new Plugin(Events, { name: 'events' });
	
module.exports = new Class({
	Implements: [Events],
	
	Whitelist: {
		events: [],
		attributes: [],
		properties: ['name', 'children']
	},
	
	parentControl: null,
	
	type: 'Control',
	
	options: {
		name: null, // ***REQUIRED FOR CONTROL LOOK-UP***
		children: [],
		events: {},
		attributes: {}
	},
	
	initialize: function(unsafeOptions){
		this.setUnsafeOptions(unsafeOptions);
		if (!this.type) throw "This control has no type, please assign one: " + this;
		this.name = this.options.name;
		this.children = [];
		this.append(this.options.children);
		this.setProperties();
		this.addEvents(this.options.events);
	},
	
	mergeUnsafeValue: function(source, key, current){
		switch (typeOf(current)){
			case 'object':
				if (typeOf(source[key]) == 'object') this.mergeUnsafeOptions(source[key], current);
				else source[key] = Object.clone(current);
			break;
			case 'array': source[key] = source[key].combine(current); break;
			default: source[key] = current;
		}
		return source;
	},

	mergeUnsafeOptions: function(source, k, v){
		if (typeOf(k) == 'string') return this.mergeUnsafeValue(source, k, v);
		for (var i = 1, l = arguments.length; i < l; i++){
			var object = arguments[i];
			for (var key in object) this.mergeUnsafeValue(source, key, object[key]);
		}
		return source;
	},
	
	setUnsafeOptions: function(unsafeOptions){
		var self = this;
		unsafeOptions = Object.map(unsafeOptions || {}, function(value, option){
			if (option == 'attributes' || option == 'events') {
				return Object.filter(value, function(value, key){										
					return self.Whitelist[option].contains(key);
				});							
			}
			else if (self.Whitelist.properties.contains(option)) return value;
		});
		this.options = this.mergeUnsafeOptions(this.options, unsafeOptions);
		return this;
	},
	
	setProperties: function(){
		if (this.Accessors) {
			Object.each(this.options, function(value, key){
				if (this.Accessors[key]) this[key] = value;
			}, this);
		}
		return this;
	},
	
	append: function(controls){
		Array.from(controls).each(function(control){
			control.parentControl = this;
			this.children.include(control);
		}, this);
		return this;
	},
	
	inject: function(control){
		this.parentControl = control;
		control.children.include(this);
		return this;
	},
	
	sanitize: function(){
		return true;
	},
	
	isDOMEvent: function(){
		return !!this.element;
	},
	
	addEvent: function(type, fn){
		if (!this.sanitize('events', type)) return this;
		if (this.isDOMEvent(type)) this.element.addListener(type, this.fireEvent.bind(this, type));
		this.addListener(type, fn);
		return this;
	},
	
	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},
	
	removeEvent: function(type){
		if (!this.sanitize('events', type)) return this;
		if (this.isDOMEvent(type)) this.element.removeListener(type, this.fireEvent.bind(this, type));
		this.removeListener(type);
		return this;
	},
	
	fireEvent: function(type, args, source){
		var args = Array.from(args);
		if (!source) args.unshift(source = this);
		this.emit.apply(this, [type, args].flatten());
		if (!this.sanitize('events', type)) return this;
		if (this.parentControl) this.parentControl.fireEvent(type, args, source);
		return this;
	}
});