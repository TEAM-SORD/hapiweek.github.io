// Require mongoose and other node modules \\
var mongoose = require("mongoose");
var ObjectId = require('mongoose').Types.ObjectId;
var uriUtil = require('mongodb-uri');
var http = require("http");
var url = require("url");
var fs = require("fs");
var Joi = require('joi');
var config = require('./config.json');

// mongoose.connect("mongodb://127.0.0.1:27017/blogpostdb");
var mongodbUri = 'mongodb://' + config.ML_UName + ':' + config.ML_PW + '@ds039301.mongolab.com:39301/sord';
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
	month  : String,
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
			if( searchCriteria.month ){
				return blogPostModel.find( searchCriteria );
			}
			searchCriteria = formatID( searchCriteria );
		}
	    return blogPostModel.find( searchCriteria );
	},
	addPost  : function( newPost, successCB ) {
		var post = new blogPostModel(newPost);
		console.log( 'Post model: ' + post );
		post.save(function (err) {
		  if (err) {
		  	console.log( 'Error: ' + err );
		  } 
		  else{
		  	console.log( 'Saved to the collection!');
		  }
		  successCB( err );
		});
	},
	updatePost : function( post, successCB ) {
		var searchCriteria = formatID( post.id );
		var  update = post, 
  			 options = { multi: true };

		blogPostModel.update(searchCriteria, update, options, successCB);
	},
	deletePost : function( post ) {


	}
};
