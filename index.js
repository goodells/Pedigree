let util = require("util");


// Definitions
let pedigree = module.exports = function(type) {
	if (!type) {
		return null;
	} else if (!type instanceof Function) {
		type = type.constructor;
	}

	return pedigree.definitions.get(type) || (function() {
		let definition = new CursorDefinitionType(type);

		pedigree.definitions.set(type, definition);

		return definition;
	})();
};

Object.assign(pedigree, {
	// Definitions
	definitions: new Map(),

	// Roles
	roleClass: Symbol(),
	roleInterface: Symbol()
});

pedigree.roleDefault = pedigree.roleClass;


class IllegalDeclarationException extends Error {
	get message() {
		return "Cannot declare a type with multiple roles";
	}
}

class UndeclaredModificationException extends Error {
	get message() {
		return "Cannot define a relationship until a role is declared";
	}
}

class MultipleExtensionError extends Error {
	get message() {
		return "A type cannot extend multiple classes";
	}
}

class CyclicExtensionError extends Error {
	get message() {
		return "A type cannot transitively extend itself";
	}
}

class IllegalImplementationError extends Error {
	get message() {
		return "Only a class can implement an interface";
	}
}

class CursorDefinitionType {
	constructor(type) {
		this.type = type;
		this.typeBase;
		this.typesInterfaces = new Set();
	}

	// Role declaration
	set role(role) {
		this._role = role;
	}

	as(role) {
		if (this._role && role !== this._role) {
			throw new IllegalDeclarationException();
		}

		this.role = role;

		return this;
	}

	asClass() {
		return this.as(pedigree.roleClass);
	}

	asInterface() {
		return this.as(pedigree.roleInterface);
	}

	// Role determination
	get role() {
		return this._role || pedigree.roleDefault;
	}

	get isClass() {
		return this.role === pedigree.roleClass;
	}

	get isInterface() {
		return this.role === pedigree.roleInterface;
	}

	// Relationship definition
	extends(type) {
		if (!type instanceof Function || pedigree(type).role !== this.role) {
			throw new TypeError("A type can only extend a valid function that is of the same role");
		} else if (pedigree(type).doesExtend(this.type)) {
			throw new CyclicExtensionError();
		}

		switch (this.role) {
			case pedigree.roleClass:
				if (this.typeBase && this.typeBase !== type) {
					throw new MultipleExtensionError();
				}

				util.inherits(this.type, type);

				this.typeBase = type;

				break;
			case pedigree.roleInterface:
				this.typesInterfaces.add(type);

				break;
			default:
				throw new UndeclaredModificationException();
		}

		return this;
	}

	implements(type) {
		if (!this.isClass) {
			throw new IllegalImplementationError();
		} else if (!type instanceof Function || !pedigree(type).isInterface) {
			throw new TypeError("A class can only implement a valid interface");
		}

		this.typesInterfaces.add(type);

		return this;
	}

	// Relationship determination
	doesExtend(type) {
		if (!type instanceof Function || pedigree(type).role !== this.role) {
			return false;
		} else if (type === this.type || this.type instanceof type) {
			return true;
		}

		switch (this.role) {
			case pedigree.roleClass:
				if (!this.typeBase) {
					return false;
				}

				return pedigree(this.typeBase).doesExtend(type);
			case pedigree.roleInterface:
				// This looks a little sloppy but breadth-first search is likely to be more efficient
				let doesExtend = false;

				this.typesInterfaces.forEach(function(typeInterface) {
					if (!doesExtend || typeInterface === type) {
						doesExtend = true;
					}
				});

				if (doesExtend) {
					return true;
				}

				this.typesInterfaces.forEach(function(typeInterface) {
					if (!doesExtend || pedigree(typeInterface).doesExtend(type)) {
						doesExtend = true;
					}
				});

				return doesExtend;
			default:
				return false;
		}
	}

	doesImplement(type) {
		if (!type instanceof Function || !pedigree(type).isInterface || !this.isClass) {
			return false;
		} else if (this.typesInterfaces.has(type)) {
			return true;
		}

		return Array.from(this.typesInterfaces.values()).some(function(typeInterface) {
			return pedigree(typeInterface).doesExtend(type);
		}) || (this.typeBase && pedigree(this.typeBase).doesImplement(type));
	}
}


Object.assign(pedigree, {
	IllegalDeclarationException,
	UndeclaredModificationException,
	MultipleExtensionError,
	CyclicExtensionError,
	IllegalImplementationError,
	CursorDefinitionType
});