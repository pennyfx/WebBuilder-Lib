var Application = require('builder/application'),
	Class = require('shipyard/class/Class');
	
module.exports.getApplication = function(){
	
	var Root = new Class(require('../../resources/controls/root/root.js'));		
	return new Application({
		resources: {
			extensions: [					
				{ path:'../../resources/extensions' , sync: 'file' }
			],
			collections: [					
				{ path:'../../resources/project_types' , sync: 'file' }
			],
			skins: [					
				{ path:'../../resources/skins' , sync: 'file' }
			],
			controls: [					
				{ path:'../../resources/controls' , sync: 'file' }
			]
		},
		root: root
	});
}

module.exports.bootStrapForNode = function(){
	require('../../lib/builder/types/Natives').install();
	window = {};
}