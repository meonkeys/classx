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
				// create inherited object
				initialize.apply(this,[to]);
				// setup scope for class instance method calls
				cloneCopy(this,this);
				if(this.initializer instanceof Function)
					this.initializer.apply(this);
				this.constructor.apply(this,arguments);
			}
		};

		// set prototype and constructor enabling proper type checking
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

  // event handlers
  Object.defineProperty(Class.prototype, "_globalEvents", {
    enumerable: false,
    configurable: false,
    value: {}
  });

  // event handlers
  Object.defineProperty(Class.prototype, "raiseEvent", {
    enumerable: false,
    configurable: false,
    value: function (event, data, global) {
      function raiseEvents(target) {
        if ( typeof target[event]  !== 'undefined' ) {
          for (var i = target[event].length - 1; i >= 0; i -= 1) {
            var callback = target[event][i];
            if ( typeof callback !== 'undefined' && callback instanceof Function ) {
              callback(data);
            }
          }
        }
      }
      global = ( typeof global === 'undefined' ) ? false : true;
      if ( typeof this._globalEvents[event]  !== 'undefined' && global === true ) { raiseEvents(this._globalEvents); }
      if ( typeof this._events[event]  !== 'undefined' ) { raiseEvents(this._events); }
    }
  });

  Object.defineProperty(Class.prototype, "addEventListener", {
    enumerable: true,
    configurable: false,
    value: function (event, callback, global) {
      function addEventListener(target) {
        if ( typeof target[event] === 'undefined' ) { target[event] = []; }
        target[event].push(callback);
      }
      global = ( typeof global === 'undefined' ) ? false : true;
      if ( global === true ) { addEventListener(this._globalEvents); }
      else { addEventListener(this._events); }
    }
  });

  Object.defineProperty(Class.prototype, "removeEventListener", {
    enumerable: true,
    configurable: false,
    value: function (event, callback, global) {
      function removeEventListener(target) {
        if ( typeof target[event]  === 'undefined' ) { return; }
        for (var i = target[event].length - 1; i >= 0; i -= 1) {
          if ( target[event][i] === callback ) {
            target[event].splice(i, 1);
            break;
          }
        }
      }
      global = ( typeof global === 'undefined' ) ? false : true;
      if ( global === true ) { removeEventListener(this._globalEvents); }
      else { removeEventListener(this._events); }
    }
  });

  // add getters and setters
  Object.defineProperty(Class.prototype, "get", {
    enumerable: false,
    configurable: false,
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
    configurable: false,
    value: function (name, func) {
      Object.defineProperty(this, name, {
        set: func,
        enumerable: true,
        configurable: true
      });
    }
  });

  // bootstrap the global base Class
	global.Class = global.Class.extend(function() {
    this._events = {};
    this.constructor = function(){};
  });

})(this);