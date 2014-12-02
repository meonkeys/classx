var env = require('system').env;
var url = env.ROOT_URL;

describe("ClassX", function() {
  before(function() {
    casper.start(url);
  });
  it("should have a global Class object", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return ( _.isObject(Class) );
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow extending a new type", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyClass = new Class.extend(function() { });
        return ( MyClass && _.isObject(MyClass) );
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow creating a new instance", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyClass = new Class.extend(function() { });
        var myClass = new MyClass();
        return ( myClass && _.isObject(myClass) && myClass instanceof MyClass);
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow accessing a public variable", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyClass = new Class.extend(function() {
          this.type = "MyClass";
        });
        var myClass = new MyClass();
        return ( myClass && myClass.type && myClass.type === "MyClass") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow accessing a public getter/setter", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyClass = new Class.extend(function() {
          var _settings;
          this.get("settings", function() { return _settings; });
          this.set("settings", function(val) { _settings = val; });
        });
        var myClass = new MyClass();
        myClass.settings = {"test": "verify"};
        return ( myClass && myClass.settings && myClass.settings.test === "verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow calling a public function", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyClass = new Class.extend(function() {
          this.echo = function(message) { return message; };
        });
        var myClass = new MyClass();
        var message = myClass.echo("verify");
        return ( message && message === "verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow calling the super constructor", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyBaseClass = Class.extend(function() {
          this.message = null;
          this.constructor = function(message) { this.message = message; }
        });
        var MyClass = MyBaseClass.extend(function() {
          this.constructor = function(message) { this.super(message); }
        });
        var myClass = new MyClass("verify");
        var message = myClass.message;
        return ( message && message === "verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow method overloading", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var MyBaseClass = Class.extend(function() {
          this.echo = function(message) { return "MyBaseClass:" + message; }
        });
        var MyClass = MyBaseClass.extend(function() {
          this.echo = function(message) { return this.super.echo("MyClass:" + message); }
        });
        var myClass = new MyClass();
        var message = myClass.echo("verify");
        return ( message && message === "MyBaseClass:MyClass:verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should fail", function() {
    casper.then(function () {
      var evalResult = false;
      evalResult.should.equal(true);
    });
  });
});