(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window',function($http,$window){
var self=this;
self.getToken=function(){
return $window.localStorage.getItem('authToken');
};
self.setToken=function(token){
$window.localStorage.setItem('authToken',token);
};
self.removeToken=function(){
$window.localStorage.removeItem('authToken');
};
self.isAuthenticated=function(){
return!!self.getToken();
};
}]);
})();