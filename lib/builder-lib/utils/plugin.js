Class.implement('addInitializer', function(name, fn){
	this.prototype.$initializers = this.prototype.$initializers || {};
	this.prototype.$initializers[name] = fn;
});

Class.Mutators.initialize = function(initialize){
	return function(){
		var args = Array.from(arguments);
		if (!this.$intialized){
			for (var z in this.$initializers) this.$initializers[z].apply(this, args);
			this.$intialized = true;
		}
		return initialize.apply(this, args);
	}
};

Plugin = function(plugin, options){
	return new Class({
		Extends: plugin,
		Implements: Options,
		options: {},
		initialize: function(settings){
			this.setOptions(options, settings);
			this.name = this.options.name || String.uniqueID();
			this.base = this.options.base;
		}
	});
};

module.exports = Plugin;

var excludes = ['$constructor', 'caller', 'parent', 'initialize'],
	attachMethods = function(key, self, plugin){
		if (typeof plugin[key] == 'function' && typeof self[key] == 'undefined' && !Array.contains(excludes, key)){
			self[key] = function(){
				self.plugins(key, Array.from(arguments));
				return self;
			}
		}
	};

Class.Mutators.Plugins = function(plugins){
	this.addInitializer('Plugins', function(){
		var instances = {};
		this.Plugins.forEach(function(plugin){
			var instance = new plugin({ base: self });
			instances[instance.name] = instance;
			for (var z in instance) attachMethods(z, self, instance);
		});
	
		this.plugins = function(key, args){
			var args = Array.from(args);
			return Object.map(this.plugins.instances, function(instance){
				console.log(instance[key]);
				if (typeof instance[key] == 'function') return instance[key].apply(instance, args);
			});
		}.extend({
			instances: instances,
			get: function(name){
				return this.instances[name] || null;
			}
		});
	});
	
	return Array.combine(this.prototype.Plugins || [], Array.from(plugins));
};

Class.Mutators.Whitelist = function(list){
	return Object.infuse(this.prototype.Whitelist || {}, list);
};

Class.Mutators.Accessors = function(accessors){
	this.addInitializer('Accessors', function(){
		for (var z in this.Accessors){
			var accessor = this.Accessors[z];			
			if (accessor.get) this.__defineGetter__(z, accessor.get);
			if (accessor.set) this.__defineSetter__(z, accessor.set);			
		}		
	});
	
	return Object.merge(this.prototype.Accessors || {}, accessors);
};