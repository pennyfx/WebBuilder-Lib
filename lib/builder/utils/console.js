
var methods = {};
for (key in console) {
	methods[key] = console[key];
}

module.exports = methods;