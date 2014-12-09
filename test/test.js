MyClass = Class.extend(function() {
  var _self, _settings;
  var _type = "MyClass";
  this.value = 44;
  this.settings = null;
  this.echo = function(message) {
    return _type + ": " + message;
  }
  this.constructor = function(settings) {
    _self = this;
    _self.settings = settings;
  }
});

MyChildClass = MyClass.extend(function() {
  var _self;
  var _type = "MyChildClass";
  this.value = 88;
  this.echo = function(message) {
    return _self.super.echo(_type + ": " + message);
  }
  this.constructor = function(settings) {
    _self = this;
    _self.super(settings);
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
