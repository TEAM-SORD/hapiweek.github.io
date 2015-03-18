// Require mongoose and other node modules \\
var mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;
var uriUtil = require('mongodb-uri');
var http = require("http");
var url = require("url");
var fs = require("fs");
var Joi = require('joi');

// mongoose.connect("mongodb://127.0.0.1:27017/blogpostdb");
var mongodbUri = 'mongodb://beechware:Pass1on8@ds039301.mongolab.com:39301/sord';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri);

// Get notification for connection success or failure \\
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
// db.once("open", function (callback) {
// 	console.log("connection made");
// });

// Define database schema which determines which properties we want to store \\
var blogSchema = mongoose.Schema({
	author : String,
	title  : String,
	text   : String,
	date   : Object,
	image  : String
});




var blogPostModel = mongoose.model("blogposts", blogSchema);

function formatID( searchCriteria ) {
	var query = { _id: new ObjectId(searchCriteria) };
	return query;
}

module.exports = {

	getPosts : function( searchCriteria ) {
		// searchCriteria = { _id : sf184943095043 }
		if( searchCriteria ) {
			searchCriteria = formatID( searchCriteria );
			//collection.update({'_id': o_id});
		}
	    return blogPostModel.find( searchCriteria );/*function(err, blogPosts) {
			console.log( 'In blogPostModel : ' + blogPosts);
			if( err ) {
				console.log( 'Error: ' + err );
			}
			doSomethingWithResults( blogPosts );
		});*/

	},
	addPost  : function( newPost, successCB ) {
		var post = new blogPostModel(newPost);
		console.log( 'Post model: ' + post );
		post.save(function (err) {
		  if (err) {
		  	console.log( 'Error: ' + err );
		  }
		  console.log( 'Saved to the collection!');
		  successCB( err );
		});
	},
	updatePost : function( post, successCB ) {
		var searchCriteria = formatID( post.id );
		var  update = post,
  			 options = { multi: true };

		blogPostModel.update(searchCriteria, update, options, successCB);
	},
	};
