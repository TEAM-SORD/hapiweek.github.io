var postsColl = require("./posts");
var Hapi = require('hapi');
// var mongoose = require("mongoose");
// var uriUtil = require('mongodb-uri');

var server = new Hapi.Server();
server.connection({ port: 3000 });

var joiSchema = Joi.object().options({ abortEarly: false }).keys({
    author: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().required(),
    image: Joi.string().optional()
});

server.register([ /* plugins */], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugins
    }

    // ... Register the routes
    server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        var query = postsColl.getPosts( );
        query.sort( {date: 'descending'} ).exec( function (err, posts) { 
            console.log( 'In getPostsForSideBar - query.exec : ' + posts ); 
            // allPosts = posts; renderOtherPane( allPosts ); 
            reply('Blog homepage here' + posts.length);
        });
            // function(err, blogPosts) {
        //     console.log( 'In blogPostModel : ' + blogPosts);
        //     if( err ) {
        //         console.log( 'Error: ' + err )

        
    }
});

server.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
        reply('Blog Post here, id: '+request.params.id);
    }
});

server.route({
    method: 'GET',
    path: '/edit',
    handler: function (request, reply) {
        reply('CMS page');
    }
});

server.route({
    method: 'GET',
    path: '/edit/{id}',
    handler: function (request, reply) {
        reply('CMS page with post' + request.params.id + 'loaded for editing');
    }
});

// payload output 'data' will read POST payload into memory. Can also be put in a file or made available as a stream
// payload parse 'true' is the default value, but worth knowing about. Uses the content-type header to parse the payload. set to false if you want the raw payload.
server.route({
    method: 'POST',
    config: { 
        validate:{
            payload: joiSchema,
        },
        payload: {output: 'data', parse: true} 
    },
    path: '/',
    handler: function (request, reply) {
        // code here to handle new post
        // request.payload.author;
        postsColl.addPost("a post to add to the database-json object", function (err){
                console.log( ( err )? 'Error posting to db: ' + err : 'Successfully added to db');
             reply('New Post Added');   
            });
        
    }

});

// PUT has a payload too..
server.route({
    method: 'PUT',
    config: { payload: {output: 'data', parse: true} },
    path: '/{id}',
    handler: function (request, reply) {
        // code here to handle post update
        reply('Post '+request.params.id +' updated');
    }
});

server.route({
    method: 'DELETE',
    path: '/{id}',
    handler: function (request, reply) {
        // code here to delete post
        reply('Post '+request.params.id +' deleted');
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});

    server.start(function () {
        // mongoose.connect(mongooseUri, function(err) {
            // if (err) console.log('error', err);
            // console.log("connected");
        // });
    });

});

// A set of example RESTful routes that could describe a blog


