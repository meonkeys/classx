var env = require('system').env;
var url = env.ROOT_URL;

describe("ClassX - Exceptions", function() {
  before(function() {
    casper.start(url);
    casper.on('remote.message', function(msg) {
        //this.echo(msg);
    })
  });
  it("should have an exception base class", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        return {
          "hasException": ( ClassX && typeof ClassX.Exception === 'function')
        }
      });
      evalResult.hasException.should.equal(true);
    });
  });
  it("show allow creating an exception with no arguments.", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myException = new ClassX.Exception();
        return {
          "isBaseType": ( myException && myException instanceof ClassX.Exception && myException.constructor.name === "Exception"),
          "hasNameProperty": ( myException.name === "Exception"),
          "hasTypeProperty": ( myException.type === "Exception")
        }
      });
      evalResult.isBaseType.should.equal(true);
      evalResult.hasNameProperty.should.equal(true);
      evalResult.hasTypeProperty.should.equal(true);
    });
  });
  it("show allow creating an argument exception with argument name, no message", function() {
    casper.then(function () {
      var evalResult = casper.evaluate(function() {
        var myException = new ClassX.ArgumentException("test");
        return {
          "isInstanceOf": ( myException && myException instanceof ClassX.ArgumentException && myException.constructor.name === "ArgumentException"),
          "hasArgNamePropertyValue": ( myException.argName === "test"),
          "hasMessagePropertyValue": ( myException.message === "The argument is invalid: test")
        }
      });
      evalResult.isInstanceOf.should.equal(true);
      evalResult.hasArgNamePropertyValue.should.equal(true);
      evalResult.hasMessagePropertyValue.should.equal(true);
    });
  });
});