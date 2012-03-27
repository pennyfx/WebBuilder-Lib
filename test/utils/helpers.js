var Application = require('../../lib/application'),
	Class = require('shipyard/class/Class');
	
module.exports.getApplication = function(bootStrapExtension){
	
	
	return new Application({
		resources: {
			extensions: [					
				{ path:'../resources/extensions' , sync: 'file' }
			],
			collections: [					
				{ path:'../resources/project_types' , sync: 'file' }
			],
			skins: [					
				{ path:'../resources/skins' , sync: 'file' }
			],
			controls: [					
				{ path:'../resources/controls' , sync: 'file' }
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