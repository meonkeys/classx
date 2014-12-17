MyClass = ClassX.extend(ClassX.Class, function(base) {
  var _created;
  Object.defineProperty(this, 'created', {
    get: function() { return _created; },
    set: function(val) { _created = val; },
    enumerable: true,
    configurable: true
  });
  this.sayHello = function() {
    return "My name is " + this.type;
  }
  this.echo = function(message) {
    return this.type + ": " + message;
  }
  this.constructor = function MyClass() {
    console.log("constructor " + this.constructor.name + " called.");
    this.type = this.constructor.name;
    this.parent = base.constructor.name;
    this.created = new Date();
  }
});

MyChild = ClassX.extend(MyClass, function(base) {
  this.echo = function(message) {
    return base.echo(this.type + ": " + message);
  }
  this.constructor = function MyChild() {
    console.log("constructor " + this.constructor.name + " called.");
    if ( base && base.constructor ) base.constructor();
    this.type = this.constructor.name;
    this.parent = base.constructor.name;
  }
});

MyGrandChild = ClassX.extend(MyChild, function(base) {
  this.echo = function(message) {
    return base.echo(this.type + ": " + message);
  }
  this.constructor = function MyGrandChild() {
    console.log("constructor " + this.constructor.name + " called.");
    if ( base && base.constructor ) base.constructor();
    this.type = this.constructor.name;
    this.parent = base.constructor.name;
  }
});

MyException = ClassX.extend(ClassX.Exception, function(base) {
  this.constructor = function MyException() {
    base.constructor.call(this, arguments);
  }
});

if (Meteor.isClient) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    var myGrandChild = new MyGrandChild();
    var myChild = new MyChild();
    var myClass = new MyClass();
    console.log(myGrandChild.echo("Hello"));
    console.log(myGrandChild.parent);
    console.log(myChild.parent);
    console.log(myClass.parent);
  });
}
