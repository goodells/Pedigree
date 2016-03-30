# Pedigree

A bare-bones inheritance framework for JavaScript

## Highlights

* Support for classes and interfaces
* Does not modify default constructors
* Tiny file size
* No third-party dependencies (only `util`)


## Installation

Install it from [NPM](https://www.npmjs.com/package/pedigree):

```
npm install pedigree
```

Alternatively, you can clone the project into a directory called `pedigree` where desired.


## Usage

### Declaring roles

Classes and interfaces must be declared as such before they can be used via the `.declareClass` and `.declareInterface` methods, respectively:

```javascript
function Weapon() {

}

pedigree.declareClass(Weapon);
```

```javascript
function IWieldable() {}

pedigree.declareInterface(IWieldable);
```

### Determining roles
The role of a constructor can be determined using the `.isClass` and `.isInterface` methods:

```javascript
pedigree.isClass(Weapon); // true
```

```javascript
pedigree.isInterface(IWieldable); // true
```

### Defining relationships

A constructor can extend a class and implement an interface with the `.extend` and `.implement` methods.  Remember to `call` the base class constructor:

```javascript
function Sword() {
	Weapon.call(this);
}

pedigree.declareClass(Sword);

pedigree.extend(Sword, Weapon);
pedigree.implement(Sword, IUsable);
```

```javascript
function IUsable() {}

pedigree.declareInterface(IUsable);

pedigree.implement(IUsable, IWieldable);
```

It is important to note that a class can `extend` at most one base class, but can `implement` an arbitrary number of interfaces.  Interfaces can `implement` other interfaces, even though that nomenclature is not widely used in real object-oriented languages.

### Determining relationships

The relationship between two constructors or an instance of a class and one constructor can be tested with the `.extends` and `.implements` methods:

```javascript
pedigree.extends(Sword, Weapon); // true

pedigree.implements(Sword, IWieldable); // true
```


## Shortcomings

* Constructors of declared constructors *are* altered slightly, which may cause conflicts
* Unimplemented methods on interfaces may not have any implementation
* There is no support for enforcing abstract or virtual members'


## Contribution and support

Please feel free to submit pull requests for new features.

Contact sam@mangane.se for additional questions or support.