var Class = require('shipyard/class/Class'),
	Options = require('shipyard/class/Options'),
	Events = require('shipyard/class/Events'),
	Plugin = require('./utils/plugin');
	//object = require('shipyard/utils/object');

var EventsPlugin = new Plugin(Events, { name: 'events' });
	
module.exports = new Class({
	Plugins: [EventsPlugin],
	Implements: [Options],
	Whitelist: {
		events: [],
		attributes: [],
		properties: ['name']
	},
	parentControl: null,
	type: 'Control',
	name: null, // ***REQUIRED***
	options: {
		children: [],
		events: {},
		attributes: {}
	},
	initialize: function(unsafeOptions){
		this.setOptions(unsafeOptions);
		if (unsafeOptions) this.parseUnsafeOptions();
		this.children = this.options.children;
		this.addEvents(this.options.events);
	},
	parseUnsafeOptions: function(){
		var whitelist = this.Whitelist;
		
		Object.each(this.options, function(value, key){
			if (whitelist.properties.contains(key) && this.Accessors[key]) this[key] = value;
		}, this);
		
		Object.merge(this.options.attributes, Object.filter(this.options.attributes, function(value, key){
			return whitelist.attributes.contains(key);
		}));
		
		Object.merge(this.options.events, Object.filter(this.options.events, function(fn, key){
			return whitelist.events.contains(key);
		}));
	},
	append: function(controls){
		Array.from(controls).each(function(control){
			control.parentControl = this;
			this.children.push(control);
		}, this);
		return this;
	},
	inject: function(control){
		this.parentControl = control;
		control.children.push(this);
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
		this.plugins('addEvent', [type, fn.bind(this)]);
		return this;
	},
	addEvents: function(events){
		for (var type in events) this.addEvent(type, events[type]);
		return this;
	},
	removeEvent: function(type){
		if (!this.sanitize('events', type)) return this;
		if (this.isDOMEvent(type)) this.element.removeListener(type, this.fireEvent.bind(this, type));
		this.plugins('removeEvent', type);
		return this;
	},
	fireEvent: function(type, args, source){
		if (!source) {
			var args = Array.from(args);
			args.unshift(this);
			source = this;
		}
		this.plugins('fireEvent', [type, args]);
		if (!this.sanitize('events', type)) return this;
		if (this.parentControl) this.parentControl.fireEvent(type, args, source);
		return this;
	}
});