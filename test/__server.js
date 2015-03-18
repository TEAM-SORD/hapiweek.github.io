var lab   = exports.lab = require("lab").script();
var assert  = require("chai").assert;
var server  = require("../server.js");

lab.experiment("This trivial test: ", function() {

  lab.test("should hopefully pass", function(done) {
    assert.equal(1+2, 3, "(1+2 = 3)");
    done();
  });
});

lab.experiment("A basic server test: ", function() {

  var options = {
    url: "/",
    method: "GET"
  };


  lab.test("The home page ", function(done) {

    server.inject(options, function(response) {

      assert.equal(response.statusCode, 200, "should return a 200 status code");
      assert.equal(typeof response.result, "string", "should reply with a string");
      // console.log("start of response", response);
      done();
    });
  });
});

//dummy post test from mad scientist

lab.experiment("Making a post", function() {

  var request = {
    url: "/posts",
    method: "POST",
    payload: {
      author: "thezurgx",
      title: "Anakin goes clubbing again",
      text: "blahblahblah"
    }
  };

  lab.test("with valid fields and returns correct json", function(done) {

    server.inject(request, function(response) {
      assert.equal(response.statusCode, 201, "should return a 201 CREATED status code");
      assert.deepEqual(response.result, request.payload, "should reply with the created post's content");
      done();
    });
  });
});

//lab.experiment(update)
//lab.experiment(user auth)
