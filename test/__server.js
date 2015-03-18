var lab   = exports.lab = require("lab").script();
var assert  = require("chai").assert;
var server  = require("../server.js");

lab.experiment("This trivial test: ", function() {

  lab.test("should hopefully pass", function(done) {
    assert.equal(1+2, 3, "(1+2 = 3)");
    done();
  });
});

lab.experiment("Try to get authenticated via Twitter: ", function() {

  var request = {
    url: "/login",
    method: "GET",
    credentials : {
      username: 'blah',
      password: 'blahaaa'
    }
  };

  lab.test("The login is already authenticated ", function(done) {

    server.inject(request, function(response) {
      console.log( response );
      console.log( "Is AUth? " + response.request.auth.isAuthenticated );
      assert.equal(response.statusCode, 302, "should return a 302 status code");
      // if( response.request.auth.isAuthenticated ) {
      //   assert.equal(typeof response.result, "string", "should reply with a string");
      // }
      // else {
      //   assert.equal(response.result, "Not Authenticated", "should reply with 'Not Authenticated'");
      // }
      // console.log("start of response", response);
      done();
    });
  });

  var options = {
    url: "/login",
    method: "GET",
    payload: {
      username: 'blah', 
      password: 'blahblahblah' 
    }
  };
  
  lab.test("The login is authenticated ", function(done) {

    server.inject(request, function(response) {
      console.log( response );
      console.log( "Is AUth? " + response.request.auth.isAuthenticated );
      assert.equal(response.statusCode, 303, "should return a 303 status code");
    });
  });
});

lab.experiment("A basic server test: ", function() {

  var request = {
    url: "/",
    method: "GET"
  };


  lab.test("The home page ", function(done) {

    server.inject(request, function(response) {
      console.log( "Is AUth? " + response.request.auth.isAuthenticated );
      console.log( response );
      assert.equal(response.statusCode, 200, "should return a 200 status code");
      //if( response.request.auth.isAuthenticated ) {
        //assert.equal(typeof response.result, "string", "should reply with a string");
      //}
      // else {
      //   assert.equal(response.result, "Not Authenticated", "should reply with 'Not Authenticated'");
      // }
      // console.log("start of response", response);
      done();
    });
  });
});

//dummy post test from mad scientist

lab.experiment("Making a post", function() {

  var request = {
    url: "/create",
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
      assert.deepEqual(response.result.author, request.payload.author, "should reply with the created post's content");
      done();
    });
  });
});

lab.experiment("update a post", function() {

  var request = {
    url: "/update",
    method: "PUT",
    payload: {
      id: '5501e86fbc35d50120279e78',
      author: "sarah j",
      title: "Happy BURTHDAY TO YOUUUU",
      text: "MMMMmmm caaaaake"
    }
  };

  lab.test("with valid fields and returns correct json", function(done) {

    server.inject(request, function(response) {
      assert.equal(response.statusCode, 201, "should return a 201 CREATED status code");
      assert.deepEqual(response.result.id, request.payload.id, "should reply with the updated post's id");
      done();
    });
  });
});
lab.experiment("open blog page", function() {

  var request = {
    url: "/blogpage",
    method: "GET",
  };

  lab.test("blog page responds with 200 for now", function(done) {

    server.inject(request, function(response) {
      assert.equal(response.statusCode, 200, "should return a 200 status code");
      assert.equal(typeof response.result, "string", "should reply with a string");
      done();
    });
  });
});
lab.experiment("open edit/new page", function() {

  var request = {
    url: "/editpage",
    method: "GET",
  };

  lab.test("edit page responds with 200 for now", function(done) {

    server.inject(request, function(response) {
      assert.equal(response.statusCode, 200, "should return a 200 status code");
      assert.equal(typeof response.result, "string", "should reply with a string");
      done();
    });
  });
});
