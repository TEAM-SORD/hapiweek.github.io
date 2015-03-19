var postsCollection = require( "./posts" );

function insertOrUpdate(request, sendResponse){
	console.log( 'In insertOrUpdate.');
	console.log( 'Req.method: ' + req.method );

	// var payload = request.payload.id;
	// return ( payload )? 
    
	// req.on('end', function() {
	// 	console.log( 'fullBody: ' + fullBody );
	// 	var decodedBody = querystring.parse(fullBody);
	// 	decodedBody.date = new Date();
	// 	if( decodedBody.id ){
	// 		console.log( 'Found id so update.');
	// 		db.updatePost(decodedBody, function(err, numAffected) {
	// 			// numAffected is the number of updated documents
	// 			console.log( ( err )? 'Error posting to db: ' + err : 'Number of posts updated (1): ' + numAffected );
	// 			sendResponse();
	// 		});
	// 	}
	// 	else {
	// 		console.log( 'No id found so insert.');
	// 		db.addPost(decodedBody, function (err){
	// 			console.log( ( err )? 'Error posting to db: ' + err : 'Successfully added to db');
	// 			sendResponse();
	// 		});
	// 	}
	// });
};

function getPostsForSideBar( renderOtherPane ){
	var query = postsCollection.getPosts();
	query.sort( {date: 'descending'} ).exec( function (err, posts) {
		console.log( 'In getPostsForSideBar - query.exec : ' + posts );
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
        request.auth.session.clear();
        request.auth.session.set(profile);
        return reply.redirect('/');
    },
	home: function (request, reply) {
		var query = postsCollection.getPosts( );
		query.sort( {date: 'descending'} ).exec( function (err, posts) { 
		    reply.view( 'index', { posts : posts, postlist: posts });
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
					reply.view( 'post', { posts : post, postlist: allPosts });
	            	//with post' + request.params.id + 'loaded for editing');
				});
    		});
		}
		else {
			reply( "Not Authenticated");
		}
    },
    editpage: function (request, reply) {
        if(request.auth.isAuthenticated) {
        	console.log("Edit Handler called.");
	        //var reqURL = url.parse( req.url, true );
			//var blog_id = reqURL.query.id;	
			var blog_id = request.query.id;
			console.log( 'Blog ID to edit: ' + blog_id );
	        getPostsForSideBar( function( allPosts ) {    		
				var query = postsCollection.getPosts( blog_id );
				query.exec(function (err, post) {
					post = ( blog_id )? post : "";
					reply.view( 'edit', { posts: post, postlist: allPosts });
				});
    		});
		}
		else {
			reply( "Not Authenticated");
		}
    },
	create: function (request, reply) {
        // code here to handle new post
        if(request.auth.isAuthenticated) {
	        // Add date to new post:
	        var payload = request.payload;
	        payload.date = new Date();
	        console.log( 'New Post created: ' + payload );
	        getPostsForSideBar( function( allPosts ) {    			 
		        postsCollection.addPost(payload, function (err){
		            console.log( ( err )? 'Error posting to db: ' + err : 'Successfully added to db');
		            reply.view( 'edit', { posts : "", postlist: allPosts } ).code(201);   
		        });
		    });
        }
		else {
			reply( "Not Authenticated");
		}
    },
	update: function (request, reply ) {
		console.log("Update Handler called.");
        if (request.auth.isAuthenticated) {
			//if PUT then do DB update
			// if POST then do DB insert/add
			request.payload.date = new Date();
			var update = (request.payload.id )? true: false;
	 
			getPostsForSideBar( function( allPosts ) {    			 
				if( update ) {
	    			postsCollection.updatePost( request.payload, function(err, numAffected) {
						// numAffected is the number of updated documents
						console.log( ( err )? 'Error posting to db: ' + err : 'Number of posts updated (1): ' + numAffected );
						reply.view( 'edit',  { posts : request.payload, postlist: allPosts } ).code(201);
					});	
	    		}
	    		else{
	    			postsCollection.addPost(request.payload, function (err){
			            console.log( ( err )? 'Error posting to db: ' + err : 'Successfully added to db');
			            reply.view( 'edit', { posts : "", postlist: allPosts } ).code(201);   
			        });
	    		}
    		});
		}
		else {
			reply( "Not Authenticated");
		}		
	}
};