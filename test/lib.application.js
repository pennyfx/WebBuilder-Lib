var Application = require('builder/application'),
	helper = require('./utils/helpers'),	
	Class = require('shipyard/class/Class');

helper.bootStrapForNode();

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
		
	},
	
	'Application.unloadCollection() should upload collection/project_type': function(beforeExit, assert){
		var bootStrapExtension = "layout";
		var app = helper.getApplication(bootStrapExtension);
		assert.eql(1, Object.keys(app.activeExtensions).length);
		app.unloadCollection();
		assert.eql(0, Object.keys(app.activeExtensions).length);
		
	},
	
	'Application.loadCollection() should load all extensions in a collection': function(beforeExit, assert){
		
		var app = helper.getApplication();
		app.loadCollection("base");
		assert.eql(1, Object.keys(app.activeExtensions).length);
		assert.isDefined(app.activeExtensions['layout']);
		
	},
	
	'Application.loadCollection() of moz-app should load all extensions in a collection and base collection': function(beforeExit, assert){
		
		var app = helper.getApplication();
		app.loadCollection("moz-app");
		assert.eql(2, Object.keys(app.activeExtensions).length);
		assert.isDefined(app.activeExtensions['layout']);
		
	}
	
}

