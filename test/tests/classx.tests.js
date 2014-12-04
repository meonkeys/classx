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
  it("should allow accessing a public getter/setter", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
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
  it("should allow raising and listening for events", function() {
    casper.then(function () {
      casper.evaluate(function() {
        var myChildClass = new MyChildClass();
        myChildClass.addEventListener("event", function(data) {
          $("body").append("<div id='event'>" + data + "</div>");
        });
        var message = myChildClass.raiseEvent("event", "verify");
      });
      casper.waitForSelector('#event', function() {
        var message = this.fetchText('#event');
         message.should.equal("verify");
      });
    });
  });
});