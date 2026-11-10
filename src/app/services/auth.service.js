(function(){
'use strict';
angular.module('creditCardApp')
.service('AuthService',['$http','$window','$q',function($http,$window,$q){
var self=this;
this.validateAuth=function(){
var token=$window.sessionStorage.getItem('authToken');
if(!token){
token='mock-jwt-token-'+Date.now();
$window.sessionStorage.setItem('authToken',token);
}
return $q.resolve({valid:true,token:token});
};
this.getToken=function(){
return $window.sessionStorage.getItem('authToken');
};
this.setToken=function(token){
$window.sessionStorage.setItem('authToken',token);
};
this.clearToken=function(){
$window.sessionStorage.removeItem('authToken');
};
}]);
})();