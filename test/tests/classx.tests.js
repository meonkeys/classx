var env = require('system').env;
var url = env.ROOT_URL;

describe("ClassX", function() {
  before(function() {
    casper.start(url);
    casper.on('remote.message', function(msg) {
        this.echo(msg);
    })
  });
  it("should have a global Class", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return ( _.isFunction(Class) );
      });
      evalResult.should.equal(true);
    });
  });
  it("should have a global Exception class", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return ( _.isFunction(Exception) && new Exception() instanceof Exception );
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow extending a new type", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return ( MyClass && _.isObject(MyClass) );
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow creating a new instance", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myClass = new MyClass();
        return ( myClass && _.isObject(myClass) && myClass instanceof MyClass);
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow accessing a public variable", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myClass = new MyClass();
        return ( myClass && myClass.value && myClass.value === 44) ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow overriding a public variable", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myChildClass = new MyChildClass();
        return ( myChildClass && myChildClass.value && myChildClass.value === 88) ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow calling a public function", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myClass = new MyClass();
        var message = myClass.echo("verify");
        return ( message && message === "MyClass: verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow calling the super constructor", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myChildClass = new MyChildClass({"test": "verify"});
        return ( myChildClass.settings.test === "verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow method overloading", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myChildClass = new MyChildClass();
        var message = myChildClass.echo("verify");
        return ( message && message === "MyClass: MyChildClass: verify") ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow raising and listening for local events", function() {
    casper.then(function () {
      casper.evaluate(function() {
        var eventHandler = function(data) {
          $("body").append("<div id='local-event'>" + data + "</div>");
        }
        var myChildClass = new MyChildClass();
        myChildClass.addEventListener("event", eventHandler, false);
        var message = myChildClass.raiseEvent("event", "verify", false);
        myChildClass.removeEventListener("event", eventHandler, false);
      });
      casper.waitForSelector('#local-event', function() {
        var message = this.fetchText('#local-event');
         message.should.equal("verify");
      });
    });
  });
  it("should allow raising and listening for global events", function() {
    casper.then(function () {
      casper.evaluate(function() {
        function eventHandler(data) {
          $("body").append("<div id='global-event'>" + data + "</div>");
        }
        var myClass = new MyClass();
        var myChildClass = new MyChildClass();
        myClass.addEventListener("event", eventHandler, true);
        var message = myChildClass.raiseEvent("event", "verify", true);
        myClass.removeEventListener("event", eventHandler, true);
      });
      casper.waitForSelector('#global-event', function() {
        var message = this.fetchText('#global-event');
         message.should.equal("verify");
      });
    });
  });
});