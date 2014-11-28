(function(global){

	// helper method for creating an super copied object clone
	function initialize(method){
		// recursivly execute parent methods
		if(method.parent instanceof Function){
			initialize.apply(this,[method.parent]);
			this.super = cloneCopy(this,
				superCopy(this,this.constructor)
			);
		}
		method.apply(this, arguments);
	};

	// helper method which allows for super referances
	function cloneCopy(from, to){
		for(var x in from){
			if(x !== "super" && from[x] instanceof Function) {
				// never create circular super referances
				to[x] = from[x].super || superCopy(from, from[x]);
			}
		}
		return to;
	};

	function superCopy(scope, method){
		var scopeSuper = scope.super;
		return method.super = function(){
			scope.super = scopeSuper;
			return method.apply(scope, arguments);
		}
	};

	//Create Class object
	global.Class = function(){};
	global.Class.extend = function ext(to) {

		function child() {
			// prevent the prototype scope set executing the constructor
			if(initialize !== arguments[0]){
				//Create inhereted object
				initialize.apply(this,[to]);
				// setup scope for class instance method calls
				cloneCopy(this,this);
				if(this.initializer instanceof Function)
					this.initializer.apply(this);
				this.constructor.apply(this,arguments);
			}
		};

		// set prototype and constructor enabeling propper type checking
		child.prototype = new this(initialize);
		child.prototype.constructor = child;

		// return expected result from toString
		child.toString = function(){
			return to.toString();
		};

		// allow the child to be extended.
		child.extend = function(target){
			// create parent referance and inherentence path
			target.parent = to;
			return ext.apply(child,arguments);
		};

		return child;
	};

	// bootstrap Class by inheriting itself with empty constructor.
	global.Class = global.Class.extend(function() {
    this.constructor = function(){};
  });

  Object.defineProperty(Class.prototype, "get", {
    enumerable: false,
    configurable: true,
    value: function (name, func) {
      Object.defineProperty(this, name, {
        get: func,
        enumerable: true,
        configurable: true
      });
    }
  });

  Object.defineProperty(Class.prototype, "set", {
    enumerable: false,
    configurable: true,
    value: function (name, func) {
      Object.defineProperty(this, name, {
        set: func,
        enumerable: true,
        configurable: true
      });
    }
  });

})(this);