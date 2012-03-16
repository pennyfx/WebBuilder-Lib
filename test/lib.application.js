var Application = require('builder/application'),
	Class = require('shipyard/class/Class');

module.exports = {
	'Application requires root node': function(beforeExit, assert){
		
		try{
			var app = new Application();
		}catch(e){		
			assert.eql('Please provide a root node',e);
		}
		
	},
	
	'Application should initialize': function(beforeExit, assert){
		
		var Root = new Class(require('../resources/controls/root/root.js'));		
		var app = new Application({
			root: root
		});
		assert.isNotNull(app);
		
	},
	
	'Application should load resources': function(beforeExit, assert){
		
		var Root = new Class(require('../resources/controls/root/root.js'));		
		var app = new Application({
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
		assert.isNotNull(app);
	}
}