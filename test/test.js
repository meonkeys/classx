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
    return "MyClass: " + message;
  }
  this.constructor = function MyClass() {
    base.constructor.call(this);
    this.type = this.constructor.name;
    this.parent = base.constructor.name;
    this.created = new Date();
  }
});

MyChild = ClassX.extend(MyClass, function(base) {
  this.echo = function(message) {
    return base.echo("MyChild: " + message);
  }
  this.constructor = function MyChild() {
    base.constructor.call(this);
    this.type = this.constructor.name;
    this.parent = base.constructor.name;
  }
});

MyGrandChild = ClassX.extend(MyChild, function(base) {
  this.echo = function(message) {
    return base.echo("MyGrandChild: " + message);
  }
  this.constructor = function MyGrandChild() {
    base.constructor.call(this);
    this.type = this.constructor.name;
    this.parent = base.constructor.name;
  }
});

MyException = ClassX.extend(ClassX.Exception, function(base) {
  this.constructor = function MyException(message) {
    base.constructor.call(this, message);
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
  });
}
