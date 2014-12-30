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