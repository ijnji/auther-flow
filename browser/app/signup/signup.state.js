'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: '/browser/app/signup/signup.html',
    controller: function($scope, AuthFactory, $rootScope) {
        $scope.submitSignUp = function(email, password) {
            AuthFactory.signup(email, password)
            .then(function() {
                return AuthFactory.getLoggedInUser();
            })
            .then(function(loggedInUser) {
                $rootScope.currentUser = loggedInUser;
            });
        };
    }
  });
});
