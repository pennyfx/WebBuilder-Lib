var Class = require('shipyard/class/Class'),
	ResourceManager = require('builder/resource-manager');	

module.exports = {
	'Resource Manager should load read directory of resources': function(beforeExit, assert){
		var path = require('path'),
			fs = require('fs');
		var controlPath = path.join(__dirname,"../resources/controls");
		var rm = new ResourceManager({ path: controlPath, sync: 'file' });
				
		assert.isDefined(rm.resources['root']);
		assert.eql(rm.resources['root'].main, 'root.js');
		assert.eql(rm.resources['root'].source.path,
			'/Users/aschaar/programming/WebBuilder2/resources/controls/root/root.js');
		
		var dirs = fs.readdirSync(controlPath);
		dirs.forEach(function(dir){
			assert.isDefined(rm.resources[dir]);
		})
		
	}
}