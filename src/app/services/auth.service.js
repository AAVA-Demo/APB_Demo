(function() {
'use strict';
angular.module('creditCardApp')
.service('AuthService', ['$window', '$http', '$q', function($window, $http, $q) {
var self = this;
self.validateSession = function() {
var token = $window.sessionStorage.getItem('authToken');
if (!token) {
return $q.reject('No token found');
}
var expiry = $window.sessionStorage.getItem('tokenExpiry');
if (expiry && new Date(expiry) < new Date()) {
return $q.reject('Token expired');
}
return $q.resolve(true);
};
self.getToken = function() {
return $window.sessionStorage.getItem('authToken');
};
self.setToken = function(token, expiresAt) {
$window.sessionStorage.setItem('authToken', token);
$window.sessionStorage.setItem('tokenExpiry', expiresAt);
};
self.clearToken = function() {
$window.sessionStorage.removeItem('authToken');
$window.sessionStorage.removeItem('tokenExpiry');
};
if (!self.getToken()) {
var mockToken = 'mock-jwt-token-' + Date.now();
var mockExpiry = new Date(Date.now() + 3600000).toISOString();
self.setToken(mockToken, mockExpiry);
}
}]);
})();