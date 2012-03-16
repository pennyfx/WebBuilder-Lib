var Class = require('shipyard/class/Class'),
	Options = require('shipyard/class/Options'),
	Events = require('shipyard/class/Events'),
	Plugin = require('builder/utils/plugin'),
	object = require('shipyard/utils/object');

var EventsPlugin = new Plugin(Events, { name: 'events' });
	
module.exports = new Class({
	Plugins: [EventsPlugin],
	Implements: [Options],
	Whitelist: {
		properties: ['name']
	},
	parentControl: null,
	type: 'Control',
	options: {
		children: []
	},
	initialize: function(options, unsafeOptions){
		this.setOptions(options);
		this.parseUnsafeOptions(unsafeOptions);
		this.children = this.options.children;
	},
	parseUnsafeOptions: function(options){	
		object.forEach(options, function(value, key){
			var property = this[key];
			if (typeof property == 'function') property.apply(this, Array.from(value));
			else this[key] = value;
		}, this);
		
		object.forEach(options.events || {}, function(fn, type){
			if (this.Whitelist.events.contains(type)) this.addEvent(type, fn);
		}, this);	
	},
	append: function(control){
		control.parentControl = this;
		this.children.push(control);
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