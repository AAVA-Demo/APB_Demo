(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window',function($http,$window){
const self=this;
self.validateSession=function(){
const token=$window.localStorage.getItem('authToken');
return !!token;
};
self.getToken=function(){
return $window.localStorage.getItem('authToken');
};
self.setToken=function(token){
$window.localStorage.setItem('authToken',token);
};
self.getUserId=function(){
return $window.localStorage.getItem('userId')||'user123';
};
}]);
})();