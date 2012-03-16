var Class = require('shipyard/class/Class');

// wrap indexdb or local storage API for this 
module.exports = new Class({
	prefix:'',
	initialize: function(prefix){
		this.prefix = prefix;	
	}
});