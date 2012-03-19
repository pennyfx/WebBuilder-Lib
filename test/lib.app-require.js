var AppRequire = require('builder/app-require'),
	helper = require('./utils/helpers'),
	Class = require('shipyard/class/Class');

helper.bootStrapForNode();

module.exports = {
	'Should Load Control': function(beforeExit, assert){
		var app = helper.getApplication(),
			extensionId = new Date().getTime();
			
		var appRequire = new AppRequire(app, extensionId);
		var Button = appRequire.require('control/button');
		assert.isDefined(Button);
	},
	
	'Should Load Button': function(beforeExit, assert){
		var app = helper.getApplication(),
			extensionId = new Date().getTime();
			
		var appRequire = new AppRequire(app, extensionId);
		var Button = appRequire.require('control/button');
		var b1 = new Button();		
		assert.eql('Button', b1.type);
	}
}