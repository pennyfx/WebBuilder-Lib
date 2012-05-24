var Logger = new Class({
	initialize: function(name){
		this.name = name;
	},
	
	log: function(){
		console.log.apply(this, this._addPrefix("",arguments));
	},
	
	debug: function(){
		console.log.apply(this, this._addPrefix("debug",arguments));
	},
	
	error: function(){	
		console.log.apply(this, this._addPrefix("error",arguments));
	},
	
	warning: function(){
		console.log.apply(this, this._addPrefix("warning",arguments));
	},
	
	_addPrefix: function(pre, args){
		var out = Array.from(args);		
		if(this.name){
			out.unshift("["+this.name+"]");
		}
		if(pre.length){
			out.unshift("["+pre+"]");			
		}
		return out;
	}
	
});

module.exports = new Logger();

module.exports.getLogger = function(name){
	return new Logger(name);
}