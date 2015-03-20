# hapiweek.github.io

##Week 8 building a blog with hapi

## HAPI
- This week we're building our web server using 'hapi' and validating blog posts entries with 'Joi' before going into the database.

## Database
- We are using mongoose for database storage and hosting our database on MongoLabs.
- We don't want you to see our database login credentials so you need to be added to ours as user and then put your login details into the config.json file detailed below!

## User Authentication
### Bell
- We've now added user authentication using 'bell' so users can login using third party api's such as twitter and github. 
- Since we haven't got our blog up on Heroku yet (where we could take advantage of ENV Vars), in order to run this you will need to get yourself set up with Twitter App keys.  Once you've done this you will need to create a file called 

```
config.json
```
Within this you can copy this example below and enter your own Key and Secret:
```
{
	"secret" : "some string for encryption",
	
	"cKey" : <YOUR-Twitter-Consumer-Key>,
	"cSecret" : <YOUR-Titter-Consumer-Secret>,
	
	"ML_UName" : <YOUR-MONGOLABS-USER_NAME>,
	"ML_PW"    : <YOUR-MONGOLABS-PASSWORD>
}
```

### Cookie
- We're using hapi-auth-cookie to allow the user to navigate through different routes on our blogging web application while staying logged in.

## Testing
- Our tests are created using Lab.
- The tests are in the ./test directory 
- To run the tests you first need to install all of the necessary modules as detailed in the 'package.json' file.

```
>npm install
>npm test
```

##Templating

- We're using 'jade' with 'hapi-views' for templating. 
- The 'jade' templates are in the /views directory.

##How to run 

```
> npm install
> nodemon server.js
```
From a browser window type:
```
http://localhost:3000
```

## Files

- ./server.js - This is where the routing is configured.
- ./handlers.js - This is where each route handler is defined.
- ./posts.js - This is where posts database management is done.
- ./config.json - This is where your config needs to live.
- ./.gitignore - You need to put the name 'config.json' in this file.
- ./css/index.css - This is where the stylesheet is.
- ./views - These are all the .jade files for html templating.
- ./test - The test directory for lab.
