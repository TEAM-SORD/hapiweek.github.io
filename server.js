var Hapi = require('hapi');
var Joi = require( "joi");
var Bell = require('bell');
var Cookie = require('hapi-auth-cookie');
var Path = require( 'path');
var handler = require("./handler");
var config = require('./config.json');

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'css')
            }
        }
    }
});
server.connection({ port: 3000 });

var joiSchema = Joi.object().keys({
    id: Joi.string().allow('').optional(),
    author: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.date().optional(),
    month: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional()
});

server.views({
    engines :  {
        jade: require( 'jade')
    },
    path: Path.join( __dirname, './views')
});

server.register([Bell, Cookie], function (err) {
    if (err) {
        throw err; // something bad happened loading the plugins
    }
    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: config.secret,
        isSecure: false,
        clientId: config.cKey,
        clientSecret: config.cSecret
    });

    server.auth.strategy('session', 'cookie', {
        password: config.secret,
        cookie: 'sid',
        redirectTo: '/login',
        redirectOnTry: false,
        isSecure: false
    });

    server.route({
        method: 'GET',
        path: '/index.css',
        handler: handler.css
    });
    server.route({
        method: 'GET',
        path: '/index.js',
        handler: handler.js
    });
    server.route({
        method: ['GET', 'POST'],
        path: '/login',
        config: {
            auth: 'twitter',
            handler: handler.login
        }
    });
    server.route({
        method: ['GET'],
        path: '/logout',
        config: {
            auth: 'session',
            handler: handler.logout
        }
    });
    // ... Register the routes
    server.route({

        method: 'GET',
        path: '/',
        handler: handler.home
    });

    server.route ({
        method: 'GET',
        path: '/home',
        handler: handler.home
    });

    server.route({
        method: 'GET',
        path: '/blogpage',
        config: {
            auth: {
                    strategy: 'session',
                    mode: 'try'
            }
        },
        handler: handler.blogpage
    });

    server.route({
        method: 'GET',
        path: '/editpage',
        config: {
            auth: {
                    strategy: 'session',
                    mode: 'try'
            }
        },
        handler: handler.editpage
    });
    server.route({
        method: 'GET',
        path: '/createpage',
        config: {
            auth: {
                    strategy: 'session',
                    mode: 'try'
            }
        },
        handler: handler.createpage
    });
    // payload output 'data' will read POST payload into memory. Can also be put in a file or made available as a stream
    // payload parse 'true' is the default value, but worth knowing about. Uses the content-type header to parse the payload. set to false if you want the raw payload.
    server.route({
        method: 'POST',
        path: '/create',
        config: { 
            validate:{
                payload: joiSchema,
            },
            auth: {
                    strategy: 'session',
                    mode: 'try'
            }
            //payload: {output: 'data', parse: true} 
        },
        handler: handler.create
    });

    // PUT has a payload too..
    server.route({
        method: 'POST',
        path: '/update',
        config: { 
            payload: {output: 'data', parse: true},
            auth: {
                    strategy: 'session',
                    mode: 'try'
            }
        },
        handler: handler.update
    });

    server.route({
        method: 'DELETE',
        //path: '/{id}',
        path: '/delete',
        handler: function (request, reply) {
            // code here to delete post
            reply('Post '+request.params.id +' deleted');
        }
    });

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });

});

// A set of example RESTful routes that could describe a blog

module.exports = server;
