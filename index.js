var util = require("util");


var pedigree = module.exports = {
	labelClass: "__class",
	labelInterface: "__interface",
	propertyBase: "__extends",
	propertyInterfaces: "__implements"
};

// Declaration
var declareAs = function(object, label) {
	object[label] = true;
};

pedigree.declareClass = function(object) {
	declareAs(object, pedigree.labelClass);
};

pedigree.declareInterface = function(object) {
	declareAs(object, pedigree.labelInterface);
};

// Modification
pedigree.extend = function(constructor, constructorBase) {
	// First, apply normal inheritance to keep compatibility with the instanceof operator
	util.inherits(constructor, constructorBase);
	
	constructor[pedigree.propertyBase] = constructorBase;
};

pedigree.implement = function(constructor, constructorInterface) {
	constructor[pedigree.propertyInterfaces] = (constructor[pedigree.propertyInterfaces] || []).concat([constructorInterface]);
};

// Operators
pedigree.isClass = function(constructor) {
	return constructor && constructor[pedigree.labelClass] === true;
};

pedigree.isInterface = function(constructor) {
	return constructor && constructor[pedigree.labelInterface] === true;
};

var normalizeConstructor = function(constructor) {
	if (constructor && !(constructor instanceof Function)) {
		constructor = constructor.constructor;
	}
	
	return constructor;
};

pedigree.extends = function(constructor, constructorBase) {
	if (!pedigree.isClass(constructorBase)) {
		return false;
	}
	
	constructor = normalizeConstructor(constructor);
	
	if (!constructor || constructor === Object) {
		return false;
	}
	
	return constructor === constructorBase || pedigree.extends(constructor[pedigree.propertyBase], constructorBase);
};

pedigree.implements = function(constructor, constructorInterface) {
	if (!pedigree.isInterface(constructorInterface)) {
		return false;
	}
	
	var constructor = normalizeConstructor(constructor);
	
	if (!constructor || constructor === Object) {
		return false;
	}
	
	var interfaces = constructor[pedigree.propertyInterfaces] || [];
	
	return interfaces.some(function(constructorInterfaceComparing) {
		return constructorInterfaceComparing === constructorInterface || pedigree.implements(constructorInterfaceComparing, constructorInterface);
	}) || pedigree.implements(constructor[pedigree.propertyBase], constructorInterface);
};