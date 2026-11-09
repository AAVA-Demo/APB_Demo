(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window',function($http,$window){
const self=this;
self.getToken=function(){
return $window.localStorage.getItem('authToken')||'mock-jwt-token';
};
self.setToken=function(token){
$window.localStorage.setItem('authToken',token);
};
self.isAuthenticated=function(){
return!!self.getToken();
};
self.logout=function(){
$window.localStorage.removeItem('authToken');
};
}]);
})();