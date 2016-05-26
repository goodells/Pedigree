let pedigree = require("pedigree");



class IKillable {
	kill() {}
	getState() {}
}

pedigree(IKillable)
	.asInterface();



class IRevivable {}

pedigree(IRevivable)
	.asInterface()
	.extends(IKillable);



class IGrowable {
	grow() {}
	get size() {}
}

pedigree(IGrowable)
	.asInterface();



class INameable {
	get name() {}
}

pedigree(INameable)
	.asInterface();



class Organism {
	get state() {
		return "alive";
	}
}

pedigree(Organism)
	.asClass()
	.implements(IRevivable);



class Animal {
	constructor() {
		this.size = 1;
		this.hunger = 100;
	}

	grow() {
		this.size *= 2;
	}

	feed() {
		this.hunger--;
	}
}

pedigree(Animal)
	.asClass()
	.extends(Organism)
	.implements(IGrowable);



class Human extends Animal {
	constructor(name) {
		super();

		this.name = name;
		this.friends = new Set();
	}

	befriend(friend) {
		this.friends.add(friend);
	}
}

pedigree(Human)
	.asClass()
	.extends(Animal)
	.implements(INameable);



// Check
let sam = new Human("Sam");

sam.feed();

let alex = new Human("Alex");

alex.befriend(sam);

console.log(alex.name + " is friends with " + sam.name); // Alex is friends with Sam

console.log(pedigree(alex.constructor).doesExtend(Human));
console.log(pedigree(alex.constructor).doesExtend(Animal));
console.log(pedigree(alex.constructor).doesExtend(Organism));

console.log(pedigree(sam.constructor).doesImplement(INameable));
console.log(pedigree(sam.constructor).doesImplement(IGrowable));
console.log(pedigree(sam.constructor).doesImplement(IKillable));
console.log(pedigree(sam.constructor).doesImplement(IRevivable));