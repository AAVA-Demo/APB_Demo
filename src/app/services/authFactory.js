angular.module('creditCardApp').factory('authFactory',['$http','$window','$q',function($http,$window,$q){
var factory={};
factory.getUserContext=function(){
var token=$window.sessionStorage.getItem('authToken');
var userId=$window.sessionStorage.getItem('userId')||'user123';
if(!token){
token='mock-jwt-token';
$window.sessionStorage.setItem('authToken',token);
$window.sessionStorage.setItem('userId',userId);
}
return{userId:userId,token:token};
};
factory.isAuthenticated=function(){
return!!$window.sessionStorage.getItem('authToken');
};
factory.logout=function(){
$window.sessionStorage.removeItem('authToken');
$window.sessionStorage.removeItem('userId');
};
return factory;
}]);