var postsCollection = require( "./posts" );
var loggedIn = false;

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
        // console.log('t', t);

        var profile = {
            token: t.token,
            secret: t.secret,
            twitterId: t.profile.id,
            twitterName: t.profile.username,
            //avatar: t.profile.raw.profile_image_url.replace('_normal', ''),
            //website: t.profile.raw.entities.url.urls[0].expanded_url,
            //about: t.profile.raw.description,
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
		var query = postsCollection.getPosts( );
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
	        payload.date = new Date();
	        console.log( 'New Post created: ' + payload );
	        getPostsForSideBar( function( allPosts ) {    			 
		        postsCollection.addPost(payload, function (err){
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
			request.payload.date = new Date();
			postsCollection.updatePost( request.payload, function(err, numAffected) {
				// numAffected is the number of updated documents
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
	}
};