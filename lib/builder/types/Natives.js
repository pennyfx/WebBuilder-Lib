
exports.install = function(){

	(function(){
		
		var typeOf = this.typeOf = function(item){
			if (item == null) return 'null';
			if (item.$family != null) return item.$family();

			if (item.nodeName){
				if (item.nodeType == 1) return 'element';
				if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
			} else if (typeof item.length == 'number'){
				if (item.callee) return 'arguments';
				if ('item' in item) return 'collection';
			}

			return typeof item;
		};

		var instanceOf = this.instanceOf = function(item, object){
			if (item == null) return false;
			var constructor = item.$constructor || item.constructor;
			while (constructor){
				if (constructor === object) return true;
				constructor = constructor.parent;
			}
			
			return item instanceof object;
		};

		// Function overloading

		var Function = this.Function;

		var enumerables = true;
		for (var i in {toString: 1}) enumerables = null;
		if (enumerables) enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'constructor'];

		Function.prototype.overloadSetter = function(usePlural){
			var self = this;
			return function(a, b){
				if (a == null) return this;
				if (usePlural || typeof a != 'string'){
					for (var k in a) self.call(this, k, a[k]);
					if (enumerables) for (var i = enumerables.length; i--;){
						k = enumerables[i];
						if (a.hasOwnProperty(k)) self.call(this, k, a[k]);
					}
				} else {
					self.call(this, a, b);
				}
				return this;
			};
		};

		Function.prototype.overloadGetter = function(usePlural){
			var self = this;
			return function(a){
				var args, result;
				if (typeof a != 'string') args = a;
				else if (arguments.length > 1) args = arguments;
				else if (usePlural) args = [a];
				if (args){
					result = {};
					for (var i = 0; i < args.length; i++) result[args[i]] = self.call(this, args[i]);
				} else {
					result = self.call(this, a);
				}
				return result;
			};
		};

		Function.prototype.extend = function(key, value){
			this[key] = value;
		}.overloadSetter();

		Function.prototype.implement = function(key, value){
			this.prototype[key] = value;
		}.overloadSetter();

		// From

		var slice = Array.prototype.slice;

		Function.from = function(item){
			return (typeOf(item) == 'function') ? item : function(){
				return item;
			};
		};

		Array.from = function(item){
			if (item == null) return [];
			return (Type.isEnumerable(item) && typeof item != 'string') ? (typeOf(item) == 'array') ? item : slice.call(item) : [item];
		};

		Number.from = function(item){
			var number = parseFloat(item);
			return isFinite(number) ? number : null;
		};

		String.from = function(item){
			return item + '';
		};

		// hide, protect

		Function.implement({

			hide: function(){
				this.$hidden = true;
				return this;
			},

			protect: function(){
				this.$protected = true;
				return this;
			}

		});

		// Type

		var Type = this.Type = function(name, object){
			if (name){
				var lower = name.toLowerCase();
				var typeCheck = function(item){
					return (typeOf(item) == lower);
				};

				Type['is' + name] = typeCheck;
				if (object != null){
					object.prototype.$family = (function(){
						return lower;
					}).hide();
				}
			}

			if (object == null) return null;

			object.extend(this);
			object.$constructor = Type;
			object.prototype.$constructor = object;

			return object;
		};

		var toString = Object.prototype.toString;

		Type.isEnumerable = function(item){
			return (item != null && typeof item.length == 'number' && toString.call(item) != '[object Function]' );
		};

		var hooks = {};

		var hooksOf = function(object){
			var type = typeOf(object.prototype);
			return hooks[type] || (hooks[type] = []);
		};

		var implement = function(name, method){
			if (method && method.$hidden) return;

			var hooks = hooksOf(this);

			for (var i = 0; i < hooks.length; i++){
				var hook = hooks[i];
				if (typeOf(hook) == 'type') implement.call(hook, name, method);
				else hook.call(this, name, method);
			}

			var previous = this.prototype[name];
			if (previous == null || !previous.$protected) this.prototype[name] = method;

			if (this[name] == null && typeOf(method) == 'function') extend.call(this, name, function(item){
				return method.apply(item, slice.call(arguments, 1));
			});
		};

		var extend = function(name, method){
			if (method && method.$hidden) return;
			var previous = this[name];
			if (previous == null || !previous.$protected) this[name] = method;
		};

		Type.implement({

			implement: implement.overloadSetter(),

			extend: extend.overloadSetter(),

			alias: function(name, existing){
				implement.call(this, name, this.prototype[existing]);
			}.overloadSetter(),

			mirror: function(hook){
				hooksOf(this).push(hook);
				return this;
			}

		});

		new Type('Type', Type);

		// Default Types

		var force = function(name, object, methods){
			var isType = (object != Object),
				prototype = object.prototype;

			if (isType) object = new Type(name, object);

			for (var i = 0, l = methods.length; i < l; i++){
				var key = methods[i],
					generic = object[key],
					proto = prototype[key];

				if (generic) generic.protect();
				if (isType && proto) object.implement(key, proto.protect());
			}

			if (isType){
				var methodsEnumerable = prototype.propertyIsEnumerable(methods[0]);
				object.forEachMethod = function(fn){
					if (!methodsEnumerable) for (var i = 0, l = methods.length; i < l; i++){
						fn.call(prototype, prototype[methods[i]], methods[i]);
					}
					for (var key in prototype) fn.call(prototype, prototype[key], key)
				};
			}

			return force;
		};

		force('String', String, [
			'charAt', 'charCodeAt', 'concat', 'indexOf', 'lastIndexOf', 'match', 'quote', 'replace', 'search',
			'slice', 'split', 'substr', 'substring', 'trim', 'toLowerCase', 'toUpperCase'
		])('Array', Array, [
			'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift', 'concat', 'join', 'slice',
			'indexOf', 'lastIndexOf', 'filter', 'forEach', 'every', 'map', 'some', 'reduce', 'reduceRight'
		])('Number', Number, [
			'toExponential', 'toFixed', 'toLocaleString', 'toPrecision'
		])('Function', Function, [
			'apply', 'call', 'bind'
		])('RegExp', RegExp, [
			'exec', 'test'
		])('Object', Object, [
			'create', 'defineProperty', 'defineProperties', 'keys',
			'getPrototypeOf', 'getOwnPropertyDescriptor', 'getOwnPropertyNames',
			'preventExtensions', 'isExtensible', 'seal', 'isSealed', 'freeze', 'isFrozen'
		])('Date', Date, ['now']);

		Object.extend = extend.overloadSetter();

		Date.extend('now', function(){
			return +(new Date);
		});

		new Type('Boolean', Boolean);

		// fixes NaN returning as Number

		Number.prototype.$family = function(){
			return isFinite(this) ? 'number' : 'null';
		}.hide();

		// Number.random

		Number.extend('random', function(min, max){
			return Math.floor(Math.random() * (max - min + 1) + min);
		});

		// forEach, each

		var hasOwnProperty = Object.prototype.hasOwnProperty;
		Object.extend('forEach', function(object, fn, bind){
			for (var key in object){
				if (hasOwnProperty.call(object, key)) fn.call(bind, object[key], key, object);
			}
		});

		Object.each = Object.forEach;

		Array.implement({

			forEach: function(fn, bind){
				for (var i = 0, l = this.length; i < l; i++){
					if (i in this) fn.call(bind, this[i], i, this);
				}
			},

			each: function(fn, bind){
				Array.forEach(this, fn, bind);
				return this;
			}

		});

		// Array & Object cloning, Object merging and appending

		var cloneOf = function(item){
			switch (typeOf(item)){
				case 'array': return item.clone();
				case 'object': return Object.clone(item);
				default: return item;
			}
		};

		Array.implement('clone', function(){
			var i = this.length, clone = new Array(i);
			while (i--) clone[i] = cloneOf(this[i]);
			return clone;
		});

		var mergeOne = function(source, key, current){
			switch (typeOf(current)){
				case 'object':
					if (typeOf(source[key]) == 'object') Object.merge(source[key], current);
					else source[key] = Object.clone(current);
				break;
				case 'array': source[key] = current.clone(); break;
				default: source[key] = current;
			}
			return source;
		};

		Object.extend({
		
			merge: function(source, k, v){
				if (typeOf(k) == 'string') return mergeOne(source, k, v);
				for (var i = 1, l = arguments.length; i < l; i++){
					var object = arguments[i];
					for (var key in object) mergeOne(source, key, object[key]);
				}
				return source;
			},

			clone: function(object){
				var clone = {};
				for (var key in object) clone[key] = cloneOf(object[key]);
				return clone;
			},

			append: function(original){
				for (var i = 1, l = arguments.length; i < l; i++){
					var extended = arguments[i] || {};
					for (var key in extended) original[key] = extended[key];
				}
				return original;
			}

		});

		// Object-less types

		['Object', 'Collection', 'Arguments'].each(function(name){
			new Type(name);
		});

		// Unique ID

		var UID = Date.now();

		String.extend('uniqueID', function(){
			return (UID++).toString(36);
		});
			
			
		// Object extensions
			
		Object.extend({
			
			get: function(object, path){
				if (typeof path == 'string') path = path.split('.');
				for (var i = 0, l = path.length; i < l; i++){
					if (hasOwnProperty.call(object, path[i])) object = object[path[i]];
					else return object[path[i]];
				}
				return object;
			},
			
			set: function(object, path, value){
				if (typeof path == 'string') path = path.split('.');
				var key = path.pop(),
					len = path.length,
					i = 0,
					current;
				while (len--){
					current = path[i++];
					object = current in object ? object[current] : (object[current] = {});
				}
				object[key] = value;
			},
			
			subset: function(object, keys){
				var results = {};
				for (var i = 0, l = keys.length; i < l; i++){
					var k = keys[i];
					if (k in object) results[k] = object[k];
				}
				return results;
			},

			map: function(object, fn, bind){
				var results = {};
				for (var key in object){
					if (hasOwnProperty.call(object, key)) results[key] = fn.call(bind, object[key], key, object);
				}
				return results;
			},

			filter: function(object, fn, bind){
				var results = {};
				for (var key in object){
					var value = object[key];
					if (hasOwnProperty.call(object, key) && fn.call(bind, value, key, object)) results[key] = value;
				}
				return results;
			},

			every: function(object, fn, bind){
				for (var key in object){
					if (hasOwnProperty.call(object, key) && !fn.call(bind, object[key], key)) return false;
				}
				return true;
			},

			some: function(object, fn, bind){
				for (var key in object){
					if (hasOwnProperty.call(object, key) && fn.call(bind, object[key], key)) return true;
				}
				return false;
			},

			keys: function(object){
				var keys = [];
				for (var key in object){
					if (hasOwnProperty.call(object, key)) keys.push(key);
				}
				return keys;
			},

			values: function(object){
				var values = [];
				for (var key in object){
					if (hasOwnProperty.call(object, key)) values.push(object[key]);
				}
				return values;
			},

			getLength: function(object){
				return Object.keys(object).length;
			},

			keyOf: function(object, value){
				for (var key in object){
					if (hasOwnProperty.call(object, key) && object[key] === value) return key;
				}
				return null;
			},

			contains: function(object, value){
				return Object.keyOf(object, value) != null;
			}

		});

		// Function prototypes

		Function.extend({

			attempt: function(){
				for (var i = 0, l = arguments.length; i < l; i++){
					try {
						return arguments[i]();
					} catch (e){}
				}
				return null;
			}

		});

		Function.implement({

			attempt: function(args, bind){
				try {
					return this.apply(bind, Array.from(args));
				} catch (e){}

				return null;
			},

			pass: function(args, bind){
				var self = this;
				if (args != null) args = Array.from(args);
				return function(){
					return self.apply(bind, args || arguments);
				};
			},

			delay: function(delay, bind, args){
				return setTimeout(this.pass((args == null ? [] : args), bind), delay);
			},

			periodical: function(periodical, bind, args){
				return setInterval(this.pass((args == null ? [] : args), bind), periodical);
			}

		});

		// Array prototypes

		Array.implement({

			clean: function(){
				return this.filter(function(item){
					return item != null;
				});
			},

			invoke: function(methodName){
				var args = Array.slice(arguments, 1);
				return this.map(function(item){
					return item[methodName].apply(item, args);
				});
			},

			associate: function(keys){
				var obj = {}, length = Math.min(this.length, keys.length);
				for (var i = 0; i < length; i++) obj[keys[i]] = this[i];
				return obj;
			},

			link: function(object){
				var result = {};
				for (var i = 0, l = this.length; i < l; i++){
					for (var key in object){
						if (object[key](this[i])){
							result[key] = this[i];
							delete object[key];
							break;
						}
					}
				}
				return result;
			},

			contains: function(item, from){
				return this.indexOf(item, from) != -1;
			},

			append: function(array){
				this.push.apply(this, array);
				return this;
			},

			getLast: function(){
				return (this.length) ? this[this.length - 1] : null;
			},

			getRandom: function(){
				return (this.length) ? this[Number.random(0, this.length - 1)] : null;
			},

			include: function(item){
				if (!this.contains(item)) this.push(item);
				return this;
			},

			combine: function(array){
				for (var i = 0, l = array.length; i < l; i++) this.include(array[i]);
				return this;
			},

			erase: function(item){
				for (var i = this.length; i--;){
					if (this[i] === item) this.splice(i, 1);
				}
				return this;
			},

			empty: function(){
				this.length = 0;
				return this;
			},

			flatten: function(){
				var array = [];
				for (var i = 0, l = this.length; i < l; i++){
					var type = typeOf(this[i]);
					if (type == 'null') continue;
					array = array.concat((type == 'array' || type == 'collection' || type == 'arguments' || instanceOf(this[i], Array)) ? Array.flatten(this[i]) : this[i]);
				}
				return array;
			},

			pick: function(){
				for (var i = 0, l = this.length; i < l; i++){
					if (this[i] != null) return this[i];
				}
				return null;
			},
			
		});

		// Number prototypes

		Number.implement({

			limit: function(min, max){
				return Math.min(max, Math.max(min, this));
			},

			round: function(precision){
				precision = Math.pow(10, precision || 0).toFixed(precision < 0 ? -precision : 0);
				return Math.round(this * precision) / precision;
			},

			times: function(fn, bind){
				for (var i = 0; i < this; i++) fn.call(bind, i, this);
			},

			toFloat: function(){
				return parseFloat(this);
			},

			toInt: function(base){
				return parseInt(this, base || 10);
			}

		});

		Number.alias('each', 'times');

		(function(math){
			var methods = {};
			math.each(function(name){
				if (!Number[name]) methods[name] = function(){
					return Math[name].apply(null, [this].concat(Array.from(arguments)));
				};
			});
			Number.implement(methods);
		})(['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'log', 'max', 'min', 'pow', 'sin', 'sqrt', 'tan']);

		// String prototypes

		String.implement({

			test: function(regex, params){
				return ((typeOf(regex) == 'regexp') ? regex : new RegExp('' + regex, params)).test(this);
			},

			contains: function(string, separator){
				return (separator) ? (separator + this + separator).indexOf(separator + string + separator) > -1 : String(this).indexOf(string) > -1;
			},

			trim: function(){
				return String(this).replace(/^\s+|\s+$/g, '');
			},

			clean: function(){
				return String(this).replace(/\s+/g, ' ').trim();
			},

			camelCase: function(){
				return String(this).replace(/-\D/g, function(match){
					return match.charAt(1).toUpperCase();
				});
			},

			hyphenate: function(){
				return String(this).replace(/[A-Z]/g, function(match){
					return ('-' + match.charAt(0).toLowerCase());
				});
			},

			capitalize: function(){
				return String(this).replace(/\b[a-z]/g, function(match){
					return match.toUpperCase();
				});
			},

			escapeRegExp: function(){
				return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
			},

			toInt: function(base){
				return parseInt(this, base || 10);
			},

			toFloat: function(){
				return parseFloat(this);
			},

			substitute: function(object, regexp){
				return String(this).replace(regexp || (/\\?\{([^{}]+)\}/g), function(match, name){
					if (match.charAt(0) == '\\') return match.slice(1);
					return (object[name] != null) ? object[name] : '';
				});
			},
			
			slugify: function(delimiter){
				delimiter = delimiter || '-';	
				var result = this.match(/(\w|-|\d)+/g)	//find words and hypens
					.join(delimiter)				// combine back together with hyphens
					.split2(delimiter)				// split2 to remove duplicate hyphens
					.join(delimiter);				// rejoin 	
				return result.toLowerCase();
			},
			
			
			split2: function(chars){
				var output = [], last = 0;  
				for(var i=0; i < this.length; i++){     //check each character
				var c = this[i];
				for(var n=0; n < chars.length; n++){  //aginst each split char
				  if(c==chars[n]){                    //when they equal
					var tmp = '';
					for(var k=last;k<i;k++){          //insert the previous word
					  tmp = tmp + this[k];
					}
					if(tmp.length>0)
					  output.push(tmp);               //into the output array
					last = i+1;
				  }
				}
				}                                       //When the end is reached
				var tmp = '';
				for(var k=last;k<i;k++){                
				tmp = tmp + this[k];                  
				}
				if(tmp.length>0)
					  output.push(tmp);               //insert the last word
				return output;
			}

		});
	
	})();
};
