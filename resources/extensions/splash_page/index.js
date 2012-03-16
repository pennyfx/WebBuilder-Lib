// this model/extension should be sandboxed, app.require() should be localized to this extension.

var Button = require('control/button'),
	ProjectLoader = require('builder/project-loader');
	
	//XHR = app.require('utils/'); // http://foobar.com <-- this whitelist entry should go in the package.json
	//console = app.require('utils/console'),

module.exports = {
	name: 'Start Page',
	onLoad: function(){
	
		console.log("instance is ", this);
		//create modal window with logo, project types, and projects loader
		// custom event needed to listen for addon install
		
		var b1 = new Button({
			name: 'testy-test'
		});		
		b1.text = 'foobar';
		b1.click = function(e){
			console.log('click click', this, e);
		}
		var root = app.controlTree.findControl('root');
		root.append(b1);
		
	},
	onUnload: function(){
		//destroy window
		console.log("unload");
	},
	
};