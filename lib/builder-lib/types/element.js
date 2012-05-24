var env = require('../utils/env');

var MockElement = new Class({
	initialize: function(){
		this.data = {};
		this.styles = {};
		this.textContent = "";
	},
	store: function(key, value){
		this.data[key] = value;
	}, 
	addEvent: function(){

	}
});

module.exports = env.platform.name == 'node' ? MockElement : Element;