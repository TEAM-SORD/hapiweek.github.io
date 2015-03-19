# hapiweek.github.io

##Week 8 building a blog with hapi


- This week we're routing with 'hapi' and validating that blog posts are being validated with 'joi' before going into the database.

- We've now added user authentication using bell so users can login using third party api's such as twitter and github. 

- We're using hapi-auth-cookie to allow the user to navigate through different routes on our blogging web application while staying logged in.

- Our tests are created using Lab.
- The tests are in the ./test directory using

```
npm test
```

- We're using mongoose to model our application data in MongoDB.

- We host our data in Mongolabs.

- And we're using mongodb-uri to parse and format our MongoDB URIs.


- The routing is done with 'hapi' in server.js.
- The handlers for the routes are in a file called handlers.js.
- Our database management is done in posts.js.


##Templating

- We're using 'jade' with 'hapi-views' for templating. 
- The 'jade' templates are in the /views directory.

##How to run 

```
node demon server.js
```
