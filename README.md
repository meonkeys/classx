# ClassX

Extends JavaScript with a simple to use Class pattern.

## Current Version

**v1.2.2**

## Setup and Configuration

To begin using the library, install the package using **Bower** or **Meteor**:

```sh
bower install classx
meteor add arsnebula:classx
```

If using **Bower**, or manually deploying the library for your
application, then add the script tag to your application:

```html
<script src="bower_components/classx/lib/js/classx.min.js"></script>
```

## Usage

### Creating a Class

To create your first class, use ``Class.extend``. Each class can have
a single public ``constructor``. The constructor can also take any
arguments that you want to pass into a new class instance.

```js
var MyClass = Class.extend(function(){
  // classes can have constructors
  this.constructor = function(){
    // ...
  };
});

console.log(new MyClass() instanceof MyClass); //=> "true"
```

### Public and Private Members

Bind public variables and methods to ``this``, otherwise
they are private, and can only be accessed inside the class instance.

```js
var MyClass = Class.extend(function(){

  // private variable
  var privateVariable = "private variable";

  // private function
  var privateFunction = function() {
    console.log("Private function called.");
  }

  // public variable
  this.publicVariable = "public variable";

  // public function
  this.publicFunction = function() {
    console.log("Public function called.");
  }

});

// public members can be accessed outside the class
var instance = new MyClass();
console.log( instance.publicVariable );
console.log( instance.publicFunction() );
```

### Getter and Setters

To support EcmaScript5 Getters and Setters, use ``this.get`` and ``this.set`` to
expose private variables.

```js
var MyClass = Class.extend(function(){

  var privateVariable;

  this.get("x", function() {
    return privateVariable;
  });

  this.set("x", function(val) {
    privateVariable = val;
  });

});

var instance = new MyClass();
instance.x = "some value";
console.log(instance.x);
//=> "some value"
```

### Events

A class includes an event system that can be used for raising events to event
subscribers that mimics the ``addEventListener`` event system in the browser ``DOM``. Events can
either be ``global`` meaning they are raised and propagated globally across all **ClassX** objects,
or if not global, are restricted to event listeners registered on the local instance.

> The event system defaults to local. To raise or subscribe to global events, you must provide
a ``global`` argument set to ``true`` on event functions.

#### Raising Events

You raise an event in your using the ``raiseEvent`` function. If no event listeners have
been added for the type of event, the event is simply ignored.

The ``raiseEvent`` function takes the following parameters:

- **event**: a string identifier for the type of event.
- **data**: a value or object containing data to be passed with the event notification.
- **global**: true or false (default) whether to raise the event to global listeners, or contrain to local listeners.

The following demonstrates raising an event within a class instance:

```js
var MyClass = Class.extend(function(){
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

### Extending a Class

A class can extend another class using the ``extend`` method. Public
members on the base class are automatically available on your extended
class instances.

```js
var MyClass = Class.extend(function(){
  this.publicVariable = "public variable";
});

var MyChildClass = MyClass.extend(function() {
});

var instance = new MyChildClass();
console.log(instance.publicVariable);
//=> "public variable"
```

### Super Constructors

When extending a class, you can execute the constructor of an extended
class using the ``this.super``.

```js
var MyClass = Class.extend(function(){

  this.constructor = function() {
    console.log("MyClass constructor called.");
  }

});

var MyChildClass = MyClass.extend(function() {

  this.constructor = function() {
    this.super();
    console.log("MyChildClass constructor called.");
  }

});

var instance = new MyChildClass();
//=> "MyClass constructor called."
//=> "MyOtherClass constructor called."
```

### Method Overloading

Any method can be overloaded when extending a class. Similar to overloading
the constructor, use ``this.super`` to access the base class, and any public
members defined on it.

```js
var MyClass = Class.extend(function() {

  this.publicMethod = function(){
     console.log("MyClass publicMethod called.");
  };

});

var MyOtherClass = MyClass.extend( function(){

  this.publicMethod = function() {
    this.super.publicMethod();
    console.log("MyOtherClass publicMethod called.");
  };

});

var instance = new MyChildClass();
instance.publicMethod();
//=> "MyClass publicMethod called."
//=> "MyOtherClass publicMethod called."

```
### Managing Binding "Loss"

JavaScript has a well known issue called **binding loss** that occurs when a function
is invoked by a reference instead of through its parent object. In these situations (e.g. callbacks)
the value of ``this`` changes. To mitigate this problem, it is recommended that you cache the
initial value of ``this`` in a local variable in the constructor, and use it when accessing
public variables and functions on your class to ensure the correct binding context.

```js
var MyClass = Class.extend(function() {

  var _self;

  this.publicMethod = function(){
     _self.publicMethod2();
  };

  this.publicMethod2 = function(){
  };

  this.constructor = function() {
    _self = this;
  }

});
```

> You can name the variable whatever you want. Variable names
commonly used includg ``_this``, ``_self``.

## Attribution

This package was based on the [ExtendJS](http://extendjs.org/) JavaScript library
licensed under [MIT](http://choosealicense.com/licenses/mit/).

## License

[MIT](http://choosealicense.com/licenses/mit/) -
Copyright (c) 2014 [Ars Nebula](http://www.arsnebula.com)