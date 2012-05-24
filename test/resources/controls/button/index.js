var ElementControl = require('builder-lib/element-control');

module.exports = {
	Extends: ElementControl,
	Whitelist: {
		properties: ['text'],
		events: ['click', 'ping']
	},
	Accessors: {
		text: {
			get: function(){				
				return this.element.textContent;
			},
			set: function(val){				
				this.element.textContent = val;				
				return this;
			}
		}
	},
	type: 'Button',
	options: {
		tag: 'button',
		attributes: {
			'class': 'button',
		}
	},
	initialize: function(unsafeOptions){		
		console.log('button init---');
		this.parent(this.options, unsafeOptions);
		this.addListener('click', function(){
			console.log('safe button click', arguments, this);
		});
		console.log('button init--- complete');
	}
}