## Web Builder Code Overview 


###Main Init

	./index.xul/html
	
	Shipyard require kicks off the app at data-main
	<script type="text/javascript" data-main="/js/builder/" src="/js/shipyard/scripts/require.js"></script>
	
	

Points to ./public/js/builder/index.js

Entry point - Load the application class

The purpose of the Application class is to handle the composition of
controls, extensions, and project types as well as providing an
abstraction for events and rendering.  Technically the application class
does not know that it's working in a browser DOM environment.  This allows
the app to possibly evolve into a general framework that could be used
to build applications in other environments.  XUL, Metro, Silverlight, etc..
	
	var App = require('./lib/builder/application');
	
Special control that sets the root as using a browser DOM

	var	Root = require('./controls/dom/root');  
	
The root element is the node that the app will live in. In this case it's
document.body

	var root = new Root(document.body);
	
Init and tell the app where to find its main resources
	
	var app = new App({
	// setup resource locations.
	// Resources can be loaded from the web and locallly
	resources: {
		extensions: [
			{ path:'http://builder.mozilla.org:1337/extensions' , sync: 'xhr' },
			{ path:'./extensions' , sync: 'file' }
		],
		...
	},
	// The first extension to load
	bootstrapExtension : 'splash_page',
	// Splash page extension will show a popup/modal with the basic IDE actions
	// such as starting a new project, opening recent files, etc..
	
	
	root: bodyElement,
	onLoad: function(){}
	});
	
	
	
### Application Init

	./public/js/buidler/lib/builder/application.js

On initialize the application will pull in and register extensions,
controls, project_types and skins.  If there is a bootStrap extension it will
pull it in and initialize it.

The final step is to render the controlTree.  How the rendering actually happens
has not been worked out yet.

### Extensions

	./public/js/builder/lib/builder/extension.js

	
The Extension class handles initalization of an extension.  It receives a reference
to the application/ide and the package.json file so it can figure out how to load the code
of the extension. (xhr or file)   Once the file is pulled in, it drops the code into
a sandbox and executes it.  The idea of developing Extensions within a sandbox
is to prevent developers from abandoning our extension, controls, require,
and controlTree model, and writing directly against the DOM.

App.Require is the special require module that is in scope in the sandbox which
allows extension developers to pull in various resources. eg Controls, XHR, File,
ControlTree, etc..



