(function(global){

	// helper method for creating an super copied object clone
	function initialize(method){
		// recursivly execute parent methods
		if ( method.parent instanceof Function) {
			initialize.apply(this,[method.parent]);
			this.super = cloneCopy(this,
				superCopy(this, this.constructor)
			);
		}
		method.apply(this, arguments);
	};

	// helper method which allows for super referances
	function cloneCopy(from, to) {
		for ( var x in from ) {
      // ignore members that should not be overwritten
			if ( x !== "super" && from[x] instanceof Function ) {
				// never create circular super referances
        to[x] = from[x].super || superCopy(from, from[x]);
			}
		}
		return to;
	};

	function superCopy(scope, method) {
		var scopeSuper = scope.super;
		return method.super = function() {
			scope.super = scopeSuper;
			return method.apply(scope, arguments);
		}
	};

	// create class object
	global.Class = function(){};
	global.Class.extend = function ext(to) {

		function child() {
			// prevent the prototype scope set executing the constructor
			if ( initialize !== arguments[0] ) {

        // create inherited object
				initialize.apply(this,[to]);

        // setup scope for class instance method calls
				cloneCopy(this, this);

				if ( this.initializer instanceof Function ) {
          this.initializer.apply(this);
        }
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



  // holds callbacks for global events
  Object.defineProperty(global.Class.prototype, "__globalEvents", {
    enumerable: false,
    configurable: false,
    value: {}
  });

  // raises an event to global or local event handlers
  Object.defineProperty(global.Class.prototype, "raiseEvent", {
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
      if ( typeof this.__globalEvents[event]  !== 'undefined' && global === true ) { raiseEvents(this.__globalEvents); }
      if ( typeof this.__localEvents[event]  !== 'undefined' ) { raiseEvents(this.__localEvents); }
    }
  });

  // add global or local event handler for event
  Object.defineProperty(global.Class.prototype, "addEventListener", {
    enumerable: false,
    configurable: false,
    value: function (event, callback, global) {
      function addEventListener(target) {
        if ( typeof target[event] === 'undefined' ) { target[event] = []; }
        target[event].push(callback);
      }
      global = ( typeof global === 'undefined' ) ? false : true;
      if ( global === true ) { addEventListener(this.__globalEvents); }
      else { addEventListener(this.__localEvents); }
    }
  });

  // remove global or local event handler for event
  Object.defineProperty(global.Class.prototype, "removeEventListener", {
    enumerable: false,
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
      if ( global === true ) { removeEventListener(this.__globalEvents); }
      else { removeEventListener(this.__localEvents); }
    }
  });

  // bootstrap the global base Class
	global.Class = global.Class.extend(function() {
    this.__localEvents = {};
    this.constructor = function(){};
  });

  global.Exception = global.Class.extend(function() {
    this.message = null;
    this.constructor = function(message) { this.message = message; }
  });

})(this);