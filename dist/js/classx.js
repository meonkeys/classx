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