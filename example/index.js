var pedigree = require("pedigree");


function IKillable() {};

pedigree.declareInterface(IKillable);

IKillable.prototype.kill = function() {};
IKillable.prototype.getState = function() {};


function IRevivable() {};

pedigree.declareInterface(IRevivable);

pedigree.implement(IRevivable, IKillable);


function IGrowable() {};

pedigree.declareInterface(IGrowable);

IGrowable.prototype.grow = function() {};
IGrowable.prototype.getSize = function() {};


function INameable() {};

pedigree.declareInterface(INameable);

INameable.prototype.getName = function() {};



function Organism() {
	this.state = "alive";
};

pedigree.declareClass(Organism);

pedigree.implement(Organism, IRevivable);


function Animal() {
	this.size = 1;
	this.hunger = 100;
};

pedigree.declareClass(Animal);

pedigree.implement(Animal, IGrowable);
pedigree.extend(Animal, Organism);

Animal.prototype.grow = function() {
	this.size *= 2;
};

Animal.prototype.getSize = function() {
	return this.size;
};

Animal.prototype.feed = function() {
	this.hunger--;
};


// With inheritance
function Human(name) {
	Animal.call(this);
	
	this.name = name;
	this.friends = new Set();
};

pedigree.declareClass(Human);

pedigree.implement(Human, INameable);
pedigree.extend(Human, Animal);

Human.prototype.getName = function() {
	return this.name;
};

Human.prototype.befriend = function(friend) {
	this.friends.add(friend);
};

// Check
var sam = new Human("Sam");

sam.feed();

var alex = new Human("Alex");

alex.befriend(sam);

console.log(alex.getName() + " is friends with " + sam.getName()); // Alex is friends with Sam

console.log(pedigree.extends(alex, Human)); // true
console.log(pedigree.extends(alex, Animal)); // true
console.log(pedigree.extends(alex, Organism));

console.log(pedigree.implements(sam, INameable)); // true
console.log(pedigree.implements(sam, IGrowable)); // true
console.log(pedigree.implements(sam, IKillable)); // true
console.log(pedigree.implements(sam, IRevivable)); // true