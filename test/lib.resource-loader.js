var	helper = require('./utils/helpers').bootStrapForNode(),
	Loader = require('builder-lib/resource-loader'),
	path = require('path');

module.exports = {
	'Should load a single file resource from file system': function(beforeExit, assert){
		
		var rootControl = Loader.loadResource("../../test/resources/controls/root/root.js",'file');
		console.log(rootControl);
		assert.isDefined(rootControl);
	},
	
	'Should fail when loading a single file resource without an extension from file system': function(beforeExit, assert){
		try{
			var rootControl = Loader.loadResource("../../test/resources/controls/root/root",'file');
		}catch(e){
			console.log(e);
			assert.eql(	34, e.errno);
		}
	},
	
	'Should list resources from file system directory': function(beforeExit, assert){
		var controls = Loader.loadResources("../../test/resources/controls/",'file');
		console.log(controls);
		
	},
	
}