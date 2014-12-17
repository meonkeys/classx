var env = require('system').env;
var url = env.ROOT_URL;

describe("ClassX", function() {
  before(function() {
    casper.start(url);
    casper.on('remote.message', function(msg) {
        //this.echo(msg);
    })
  });
  it("should have a global namespace", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return {
          "hasNamespace": ( typeof ClassX === 'object' ),
          "hasExtend": ( ClassX && typeof ClassX.extend === 'function'),
          "hasClass": ( ClassX && typeof ClassX.Class === 'function'),
          "hasException": ( ClassX && typeof ClassX.Exception === 'function')
        }
      });
      evalResult.hasNamespace.should.equal(true);
      evalResult.hasExtend.should.equal(true);
      evalResult.hasClass.should.equal(true);
      evalResult.hasException.should.equal(true);
    });
  });
  it("should allow creating an instance with a proper type and constructor name", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myClass= new MyClass();
        return ( myClass && myClass instanceof MyClass && myClass.constructor.name === "MyClass");
      });
      evalResult.should.equal(true);
    });
  });
  it("should support instanceof operator and prototype chaining", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myGrandChild = new MyGrandChild();
        return (
          myGrandChild instanceof MyGrandChild &&
          myGrandChild instanceof MyChild &&
          myGrandChild instanceof MyClass &&
          myGrandChild instanceof ClassX.Class
        )
      });
      evalResult.should.equal(true);
    });
  });

  it("should allow access to base class", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myGrandChild = new MyGrandChild();
        var myChild = new MyChild();
        var myClass = new MyClass();
        return {
          "myGrandChild": ( myGrandChild && myGrandChild.parent && myGrandChild.parent === "MyChild"),
          "myChild": ( myChild && myChild.parent && myChild.parent === "MyClass"),
          "myClass": ( myClass && myClass.parent && myClass.parent === "Class"),
        }
      });
      evalResult.myGrandChild.should.equal(true);
      evalResult.myChild.should.equal(true);
      evalResult.myClass.should.equal(true);
    });
  });
  it("should allow accessing a getter/setter property across inheritance chain", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var now = new Date();
        var myClass = new MyClass();
        var myChild = new MyChild();
        myClass.created = now;
        return ( myChild.created === now );
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow setting a public variable", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myClass = new MyClass();
        myClass.test = "verify";
        return ( myClass && myClass.test && myClass.test === "verify" ) ? true : false;
      });
      evalResult.should.equal(true);
    });
  });
  it("should allow calling a public function across inheritance chain", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myGrandChild = new MyGrandChild();
        var myChild = new MyChild();
        var myClass = new MyClass();
        return {
          "helloGrandChild": myGrandChild.sayHello(),
          "helloChild": myChild.sayHello(),
          "helloClass": myClass.sayHello()
        }
      });
      evalResult.helloGrandChild.should.equal("My name is MyGrandChild");
      evalResult.helloChild.should.equal("My name is MyChild");
      evalResult.helloClass.should.equal("My name is MyClass");
    });
  });
  it("should allow method overloading", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myGrandChild = new MyGrandChild();
        var message = myGrandChild.echo("Hello");
        return ( message && message === "MyClass: MyChild: MyGrandChild: Hello") ? true : false;
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
        var myChild = new MyChild();
        myChild.addEventListener("event", eventHandler, false);
        var message = myChild.raiseEvent("event", "verify", false);
        myChild.removeEventListener("event", eventHandler, false);
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
        var myChild = new MyChild();
        myClass.addEventListener("event", eventHandler, true);
        var message = myChild.raiseEvent("event", "verify", true);
        myClass.removeEventListener("event", eventHandler, true);
      });
      casper.waitForSelector('#global-event', function() {
        var message = this.fetchText('#global-event');
         message.should.equal("verify");
      });
    });
  });
});