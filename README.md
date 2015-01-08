# ClassX

Extends JavaScript with a simple to use Class pattern.

## Current Version

**v2.0.4**

## Setup and Configuration

To begin using the library, install the package using **Bower** or **Meteor**:

```sh
bower install classx
meteor add arsnebula:classx
```

If using **Bower**, or manually deploying the library for your
application, then add the script tag to your application:

```html
<script src="bower_components/classx/dist/js/classx.min.js"></script>
```

## Usage

### Getting Started

The main entry point for the package is the ``ClassX`` object. The core functionality
is provided by the ``extend`` method that is used support a
**classical inheritance** pattern.

The ``extend`` method takes two parameters:

- **object**: An object that will become the base class.
- **extensions**: A function enclosing additional methods to extend the base class.

The ``extend`` method returns a new object.

```js
var MyClass = ClassX.extend( Object, function() {
  this.constructor = function MyClass() {
    console.log(this.constructor.name); //=> "MyClass"
  }
});
```
As demonstrated above, if you provide a **named** function for the constructor,
you will be able to get the constructor name from the context.

```js
var MyChild = ClassX.extend( MyClass, function(base) {
  this.constructor = function MyChild() {
    if ( base && base.constructor ) base.constructor.call(this));
    console.log(this.constructor.name); //=> "MyChild"
  }
});
```

The ``extend`` function passes the base class as an argument to the ``extensions``
function. To access the base class, either provide a named argument, or
use the JavaScript ``arguments[0]`` array.

```js
var myInstance = new MyChild();
console.log(myInstance instanceof Object);    //=> true
console.log(myInstance instanceof MyClass);   //=> true
```

As shown above, the extend member will also setup the prototypal chain to correctly support the
``instanceof`` operator.

### Base Classes

The package includes two pre-defined base classes, ``ClassX.Class`` and ``ClassX.Exception`` that can be
used to create custom classes and exceptions respectively.

```js
var MyClass = ClassX.extend( ClassX.Class, function(base) {
  this.constructor = function MyClass() {
    if ( base && base.constructor )  base.constructor.call(this);
  };
});

var MyException = ClassX.extend( ClassX.Exception, function(base) {
  this.constructor = function MyException() {
    if ( base && base.constructor )  base.constructor.call(this);
  }
});

```

The ``ClassX.Exception`` class extends the native JavaScript ``Error`` object and provides the
common cross-browser properties including:

- **name**: the constructor name.
- **type**: also set to the constructor name.
- **message**: the error message.
- **stack**: the stack trace if available.

> It is important to use a **named** function for the constructor in order to properly
set the name and type properties on the new object.

```js
var myException = new ClassX.Exception("Some exception.");
console.log(myException instanceof Error);              //=> true
console.log(myException instanceof ClassX.Exception);   //=> true
console.log(myException.name === "MyException")         //=> true
```

### Constructors

Every class must contain a ``constructor`` method. Common activities performed in the constructor
including invoking the base class constructor, and initializing properties
on the class instance.

```js
var MyClass = ClassX.extend( ClassX.Class, function(base) {
  // declare a named function for the constructor
  this.constructor = function MyClass() {
    // invoke a base constructor if present
    if ( base && base.constructor ) base.constructor.call(this);
    // initialize properties
    this.prop1 = ...;
  }
});
```

### Properties

Properties have diffrent visibility and scope depending on how they are implemented:

- **shared**: shared properties share their value across all instances of a class
- **public**: public property values are specific to each instance of a class.

```js
var MyClass = ClassX.extend( ClassX.Class, function(base) {

  // **WARNING** a private shared property is shared across all instances of classes
  // but only accessible to methods within this closure
  var privateSharedProperty = "private shared property";

  // **WARNING** a public shared property value is shared across all instances of a class
  this.publicSharedProperty = "public shared property";

  this.constructor = function MyClass() {

    // var private property will be unique for each instance of a class
    // but is only accessible within the constructor
    var privateProperty = "private property";

    // a public property value is unique for each instance of a class
    // and must be set in the constructor
    this.publicProperty = "public property";

  }

});
```

### Methods

Methods can be public or private.

```js
var MyClass = ClassX.extend( ClassX.Class, function(base) {
  // private methods are only available within this closure
  var privateMethod = function() {
    // do something
  }
  // public methods are available anywhere
  this.publicMethod = function() {
    // do something
    privateMethod.call(this);
  }
}
});
```

Private methods do not have any binding concept, or intrinsically have
access to properties or methods stored on ``this``. To provide them access
to class instance properties or prototype methods, you need to provide them
a binding context when they are called using the JavaScript
function ``.call()`` extension.

### Getter/Setters

ECMAScript5 introduced getter/setter properties that allow get and set functions
to wrap an internal variable, but behave the same as simple types.

```js
var MyClass = ClassX.extend( ClassX.Class, function(base) {
  var _setting = "setting";
  Object.defineProperty(this, 'setting', {
    get: function() { return _setting; },
    set: function(val) { _setting = val; },
    enumerable: true,
    configurable: true
  });
});
```

> Since getters and setters often wrap private properties, be aware that all classes
extend from this base will get or set the same value.

### Events

A class includes an event system that can be used for raising events to event
subscribers that mimics the ``addEventListener`` event system in the browser ``DOM``. Events can
either be ``global`` meaning they are raised and propagated globally across all **ClassX** objects,
or if not global, are restricted to event listeners registered on the local instance.

> The event system defaults to local. To raise or subscribe to global events, you must provide
a ``global`` argument set to ``true`` on event functions.

#### Raising Events

You raise an event in your class using the ``raiseEvent`` function. If no event listeners have
been added for the type of event, the event is simply ignored.

The ``raiseEvent`` function takes the following parameters:

- **event**: a string identifier for the type of event.
- **data**: a value or object containing data to be passed with the event notification.
- **global**: true or false (default) whether to raise the event to global listeners, or contrain to local listeners.

The following demonstrates raising an event within a class instance:

```js
var MyClass = ClassX.extend( ClassX.Class, function(base){
  this.constructor = function() {
    this.raiseEvent(event, data, global);
  }
});
```

#### Event Handlers

To receive an event outside of a class, you add an event listener using ``addEventListener`` with
the following arguments:

- **event**: string identifier of the event to subscribe to.
- **callback**: a function taking a single ``data`` argument that is called when an event is raised.
- **global**: true or false (default) whether to subscribe locally to the instance, or to all global events.

The following is an example of adding and remove an event listener:

```js
var myClass = new MyClass();
var handler = function(data) { console.log(data); }
myClass.addEventListener(event, handler, global);
myClass.removeEventListener(event, handler, global);
```

To remove the event listener, call the ``removeEventListener`` function.

## License

[MIT](http://choosealicense.com/licenses/mit/) -
Copyright (c) 2014 [Ars Nebula](http://www.arsnebula.com)