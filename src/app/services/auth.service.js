(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$window','$http',function($window,$http){
var vm=this;
vm.isAuthenticated=function(){
var token=$window.localStorage.getItem('authToken');
return!!token;
};
vm.getToken=function(){
return $window.localStorage.getItem('authToken');
};
vm.login=function(){
var mockToken='mock-jwt-token-'+Date.now();
$window.localStorage.setItem('authToken',mockToken);
};
vm.logout=function(){
$window.localStorage.removeItem('authToken');
};
vm.validateSession=function(){
return vm.isAuthenticated();
};
}]).factory('AuthInterceptor',['$q','$window',function($q,$window){
return{request:function(config){
var token=$window.localStorage.getItem('authToken');
if(token){
config.headers.Authorization='Bearer '+token;
}
return config;
},responseError:function(rejection){
if(rejection.status===401){
$window.localStorage.removeItem('authToken');
window.location.href='#/dashboard';
}
return $q.reject(rejection);
}};
}]).config(['$httpProvider',function($httpProvider){
$httpProvider.interceptors.push('AuthInterceptor');
}]);