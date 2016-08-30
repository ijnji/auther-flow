'use strict'; 

var app = require('express')();
var path = require('path');
var session = require('express-session');
var chalk=require('chalk');
var bodyParser=require("body-parser");
var User=require ('../api/users/user.model.js');

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'tongiscool' // or whatever you like
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});


app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());


app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(require('./statics.middleware'));

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.post('/login', function(request, response, next){
	var email=request.body.email;
	var password=request.body.password;
	User.findOne({
		where:
			request.body
	})
	.then(function(object){
		if (object){
			request.session.userId=object.id;
			response.sendStatus(204);
		}
		else{
			response.sendStatus(401)
		}
	})
	.catch(next)
})

app.use(require('./error.middleware'));


module.exports = app;
