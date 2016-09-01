app.factory('AuthFactory', function($http) {
    return {
        login: function(email, password) {
            return $http.post('/login', {
                email: email,
                password: password
            })
            .then(function(res) {
                return res.data;
            });
        },
        signup: function(email, password) {
            return $http.post('/signup', {
                email: email,
                password: password
            })
            .then(function(res) {
                return res.data;
            });
        },
        logout: function() {
            return $http.get('/logout')
            .then(function(res) {
                return res.data;
            });
        },
        getLoggedInUser: function() {
            return $http.get('/auth/me')
            .then(function(res) {
                return res.data;
            });
        }
    };
});