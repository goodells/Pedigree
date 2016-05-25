# Pedigree

A bare-bones inheritance framework for JavaScript

## Highlights

* Support for classes and interfaces
* Cyclic extension is forbidden
* Does not modify any constructors or default objects
* Tiny file size
* No third-party dependencies (only `util`)
* Method-chaining interface


## Installation

Install it from [NPM](https://www.npmjs.com/package/pedigree):

```
npm install pedigree
```

Alternatively, you can clone the project into a directory called `pedigree` where desired.


## Usage

### A note on method-chaining

To interact with a type, you will first need to call `pedigree(Type)`.  This returns a cursor object whose methods can be chained together.  For example, you may do something like this:

```javascript
pedigree(Type)
	.asClass()
	.extends(AnotherType)
	.implements(ISomeInterface);
```

This is functionally equivalent to the following:

```javascript
pedigree(Type).asClass();
pedigree(Type).extends(AnotherType);
pedigree(Type).implements(ISomeInterface);
```

Please don't do that.

### Declaring roles

Classes and interfaces must be declared as such before they can be used via the `.asClass` and `.asInterface` methods, respectively:

```javascript
class Weapon {
	attack(enemy) {
		enemy.health -= this.damage(enemy);
	}

	getDamage(enemy) {} // @abstract
}

pedigree(Weapon).asClass();
```

```javascript
class IWieldable {
	isWielded() {}
}

pedigree(IWieldable).asInterface();
```

Once a role is declared, it cannot be altered.

### Determining roles

The role of a type can be determined using the `.isClass` and `.isInterface` properties:

```javascript
pedigree(Weapon).isClass; // true
```

```javascript
pedigree(IWieldable).isInterface; // true
```

By default, all types are classes.

### Defining relationships

A class can extend a class and implement an interface.  An interface can only extend other interfaces.  These actions are performed with the `.extends` and `.implements` methods:

```javascript
class Sword {
	constructor() {
		super();
	}

	getDamage(enemy) {
		return 30; // Equally effective against all enemies
	}
}

pedigree(Sword)
	.asClass()
	.extends(Weapon)
	.implements(IUsable);
```

```javascript
class IUsable {
	use() {}
}

pedigree(IUsable)
	.asInterface()
	.extends(IWieldable);
```

It is important to note that a class can extend at most one base class, but can implement an arbitrary number of interfaces.

### Determining relationships

The relationship between two types can be tested with the `.doesExtend` and `.doesImplement` methods:

```javascript
pedigree(Sword).doesExtend(Weapon); // true

pedigree(Sword).doesImplement(IWieldable); // true
```

These methods are not do not follow the chaining pattern because they return a value.

## Shortcomings

* Unimplemented methods on interfaces may not have any implementation
* There is no support for enforcing abstract or virtual members
* It is not feasible to add support for using the `pedigree` function with instances of classes


## Contribution and support

Please feel free to submit pull requests for new features, but do include tests.

Contact sam@mangane.se for additional questions or support.