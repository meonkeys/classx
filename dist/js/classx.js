ClassX = {};

ClassX.extend = function(base, ext) {

  var baseP = base.prototype;
  var childP = Object.create(baseP);
  ext.call(childP, baseP);

  if ( !childP.hasOwnProperty("constructor")) { return childP; }
  var constructor = childP.constructor;
  constructor.prototype = childP;
  return constructor;

};

ClassX.Exception = ClassX.extend(Error, function(base) {

  this.constructor = function Exception(message) {

    this.name = this.constructor.name;
    this.type = this.constructor.name;
    this.message = message;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      var stack = new Error().stack;
      if (typeof stack === "string") {
        stack = stack.split("\n");
        stack.shift();
        this.stack = stack.join("\n");
      }
    }
  }

});

ClassX.Class = ClassX.extend(Object, function() {

  this.__globalEvents = {};

  this.raiseEvent = function (event, data, global) {
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
  };

  this.addEventListener = function (event, callback, global) {
    function addEventListener(target) {
      if ( typeof target[event] === 'undefined' ) { target[event] = []; }
      target[event].push(callback);
    }
    global = ( typeof global === 'undefined' ) ? false : true;
    if ( global === true ) { addEventListener(this.__globalEvents); }
    else { addEventListener(this.__localEvents); }
  };

  this.removeEventListener = function (event, callback, global) {
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

  this.constructor = function Class() {
    this.__localEvents = {};
  };
});
/**
* The exception that is thrown when one of the arguments provided to a method is not valid.
*/
ClassX.ArgumentException = ClassX.extend(ClassX.Exception, function(base) {
  this.constructor = function ArgumentException(argName, message) {
    if ( ! message ) {
      message = "The argument is invalid";
      if ( argName && typeof argName === "string" ) { message = message + ": " + argName; }
    }
    base.constructor.call(this, message);
    this.argName = argName;
  }
});

/**
* The exception that is thrown when a required argument provided to a method is null.
*/
ClassX.ArgumentNullException = ClassX.extend(ClassX.ArgumentException, function(base) {
  this.constructor = function ArgumentNullException(argName, message) {
    if ( ! message ) {
      message = "The argument is null or undefined";
      if ( argName && typeof argName === "string" ) { message = message + ": " + argName; }
    }
    base.constructor.call(this, argName, message);
  }
});

/**
* The exception thrown when an argument is outside the range of acceptable values.
*/
ClassX.ArgumentOutOfRangeException = ClassX.extend(ClassX.ArgumentException, function(base) {
  this.constructor = function ArgumentOutOfRangeException(argName, message) {
    if ( ! message ) {
      message = "The argument is outside the range of acceptable values";
      if ( argName && typeof argName === "string" ) { message = message + ": " + argName; }
    }
    base.constructor.call(this, argName, message);
  }
});

/**
* The exception that is thrown when the format of an argument is invalid.
*/
ClassX.ArgumentFormatException = ClassX.extend(ClassX.ArgumentException, function(base) {
  this.constructor = function ArgumentFormatException(argName, message) {
    if ( ! message ) {
      message = "The format of the argument is invalid";
      if ( argName && typeof argName === "string" ) { message = message + ": " + argName; }
    }
    base.constructor.call(this, argName, message);
  }
});