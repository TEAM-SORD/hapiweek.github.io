var moment = require( 'moment' );
var postsCollection = require( "./posts" );
var loggedIn = false;

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getPostsForSideBar( renderOtherPane ){
	var query = postsCollection.getPosts();
	query.sort( {date: 'descending'} ).exec( function (err, posts) {
		console.log( 'In getPostsForSideBar - query.exec : ' + posts.length );
		allPosts = posts;
		renderOtherPane( allPosts );
	});
}
module.exports = {

	css: function (request, reply) {
        reply.file('index.css');
	},
	login: function (request, reply) {
        var t = request.auth.credentials;
        var profile = {
            token: t.token,
            secret: t.secret,
            twitterId: t.profile.id,
            twitterName: t.profile.username,
            fullName: t.profile.displayName,
        };
        // console.log('profile', profile);
        loggedIn = true;
        request.auth.session.clear();
        request.auth.session.set(profile);
        return reply.redirect('/');
    },
    logout: function (request, reply) {
    	loggedIn = false;
        request.auth.session.clear();
        return reply.redirect('/');
    },
	home: function (request, reply) {
		console.log( 'In home handler: ' + request.query.id);
		var month = request.query.id;
		var searchCriteria = "";
		if( month ){
			searchCriteria = {'month': month};
		}
		var query = postsCollection.getPosts( searchCriteria );
		query.sort( {date: 'descending'} ).exec( function (err, posts) { 
		    reply.view( 'index', { posts : posts, postlist: posts, loggedIn: loggedIn });
		});
	},
	blogpage: function (request, reply) {
		console.log("BlogPage Handler called.");
		if(request.auth.isAuthenticated) {
    		getPostsForSideBar( function( allPosts ) {
	    		var blog_id = request.query.id;
	    		console.log( 'BLOG_ID: ' + blog_id );
				var query = postsCollection.getPosts( blog_id );
				query.exec(function (err, post) {
					reply.view( 'post', { posts : post, postlist: allPosts, loggedIn: loggedIn });
	            	//with post' + request.params.id + 'loaded for editing');
				});
    		});
		}
		else {
			reply( "Not Authenticated");
		}
    },
    editpage: function (request, reply) {
    	console.log("Edit Handler called.");
        if(request.auth.isAuthenticated) {
			var blog_id = request.query.id;
			console.log( 'Blog ID to edit: ' + blog_id );
	        getPostsForSideBar( function( allPosts ) {    		
				var query = postsCollection.getPosts( blog_id );
				query.exec(function (err, post) {
					post = ( blog_id )? post : "";
					reply.view( 'edit', { posts: post, postlist: allPosts, loggedIn: loggedIn });
				});
    		});
		}
		else {
			reply( "Not Authenticated");
		}
    },
    createpage: function (request, reply) {
       	console.log("Create page Handler called.");
        if (request.auth.isAuthenticated) {
	        getPostsForSideBar( function( allPosts ) {    		
				var query = postsCollection.getPosts();
				query.exec(function (err, post) {
					reply.view( 'new', { posts: "", postlist: allPosts, loggedIn: loggedIn });
				});
    		});
		}
		else {
			reply( "Not Authenticated");
		}
    },
	create: function (request, reply) {
        // handle request to create a new 
		console.log("Create Handler called.");
        if(request.auth.isAuthenticated) {
	        // Add date to new post:
	        var payload = request.payload;
	        payload.date = moment().format('MMMM Do YYYY');
	        payload.month = moment().format('MMMM' );
	        console.log( 'New Post created: ' + payload );
	        postsCollection.addPost(payload, function (err){
	        	getPostsForSideBar( function( allPosts ) {    	
		            console.log( ( err )? 'Error posting to db: ' + err : 'Successfully added to db');
		            reply.view( 'edit', { posts : "", postlist: allPosts, loggedIn: loggedIn } ).code(201);   
		        });
		    });
        }
		else {
			reply( "Not Authenticated");
		}
    },
	update: function (request, reply ) {
        // handle request to update an existing post
		console.log("Update Handler called.");
        if (request.auth.isAuthenticated) {
			var payload = request.payload;
	        payload.date = moment().format('MMMM Do YYYY');
	        payload.month = moment().format('MMMM' );
			postsCollection.updatePost( request.payload, function(err, numAffected) {
				console.log( ( err )? 'Error posting to db: ' + err : 'Number of posts updated (1): ' + numAffected );
				// need to refresh blog list sidebar
				getPostsForSideBar( function( allPosts ) {
					reply.view( 'edit',  { posts : [request.payload], postlist: allPosts, loggedIn: loggedIn } ).code(201);
				});
			});	
		}
		else {
			reply( "Not Authenticated");
		}		
	},
	delete: function (request, reply) {
		if (request.auth.isAuthenticated) {
			console.log( "In Delete Handler");
			postsCollection.deletePost( request, function(err, numAffected) {
				console.log( ( err )? 'Error posting to db: ' + err : 'Number of posts deleted (1): ' + numAffected );
				reply.redirect( '/editpage');
			});
		}
		else {
			reply( "Not Authenticated");
		}
	}
};