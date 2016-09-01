'use strict';

var app = angular.module('auther', ['ui.router']);

app.config(function ($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
});

app.run(function(AuthFactory, $rootScope) {
    AuthFactory.getLoggedInUser()
    .then(function(user) {
        $rootScope.currentUser = user;
    })
    .catch(function() {
        $rootScope.currentUser = null;
    });
});