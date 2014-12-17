Package.describe({
  "name": "arsnebula:classx",
  "summary": "Extends JavaScript with a simple to use Class pattern.",
  "version": "2.0.0",
  "git": "https://github.com/arsnebula/classx.git"
});

Package.onUse(function(api) {

  api.versionsFrom("1.0");

  api.addFiles([
    "lib/js/classx.js"
  ], ["client", "server"]);

  api.export("ClassX");

});