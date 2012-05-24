
	
module.exports.getApplication = function(bootStrapExtension){

	var Application = require('builder-lib/application'),
		path = require('path');

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
	require('../../scripts/mootools.js');
	console.log("loaded moo.");
	require('builder-lib/types/Natives').install();
	window = {};
	return this;
}