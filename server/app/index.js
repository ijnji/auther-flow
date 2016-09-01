'use strict';

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');

app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(require('./statics.middleware'));

var session = require('express-session');

app.use(session({
  secret: 'supersecret'
}));

app.use('/api', function(req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});

app.use(function(req, res, next) {
  console.log('session', req.session);
  next();
});

app.use('/api', require('../api/api.router'));

app.post('/login', function(req, res, next) {
  User.findOne({
    where: req.body
  })
  .then(function(user) {
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.userId = user.id;
      res.sendStatus(204);
    }
  });
});

app.get('/logout', function(req, res, next) {
  req.session.userId = null;
  res.sendStatus(204);
});

app.post('/signup', function(req, res, next) {
  User.findOrCreate({
    where: {
      email: req.body.email
    },
    defaults: {
      password: req.body.password
    }
  })
  .spread(function(user) {
    req.session.userId = user.id;
    res.send(user);
  })
  .catch(function(err) {
    console.log(err);
  });
});

app.get('/auth/me', function(req, res, next) {
  if (!req.session.userId) {
    res.sendStatus(401);
  } else {
    User.findById(req.session.userId)
    .then(function(user) {
      res.send(user);
    })
    .catch(function(err) {
      console.log(err);
    });
  }
});

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', 'login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function(stateRoute) {
  app.get(stateRoute, function(req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = app;