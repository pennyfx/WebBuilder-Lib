var Application = require('../../lib/application'),
	Class = require('shipyard/class/Class'),
	path = require('path');
	
module.exports.getApplication = function(bootStrapExtension){
	
	
	return new Application({
		resources: {
			extensions: [					
				{ path: path.join(__dirname, '../resources/extensions') , sync: 'file' }
			],
			collections: [					
				{ path: path.join(__dirname, '../resources/project_types') , sync: 'file' }
			],
			skins: [					
				{ path: path.join(__dirname, '../resources/skins') , sync: 'file' }
			],
			controls: [					
				{ path: path.join(__dirname, '../resources/controls') , sync: 'file' }
			]
		},
		root: {},
		bootstrapExtension: bootStrapExtension
	});
}

module.exports.bootStrapForNode = function(){
	require('../../lib/types/Natives').install();
	window = {};
}