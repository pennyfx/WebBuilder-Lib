// this model/extension should be sandboxed, app.require() should be localized to this extension.

var Button = require('control/button'),
	ProjectLoader = require('builder/project-loader');
	
	//XHR = app.require('utils/'); // http://foobar.com <-- this whitelist entry should go in the package.json
	//console = app.require('utils/console'),

module.exports = {
	name: 'layout',
	onLoad: function(){
		
		var root = app.controlTree.findControl('root');
		
	},
	onUnload: function(){
		//destroy window
		console.log("unload");
	},
	
};