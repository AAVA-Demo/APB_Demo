(function(){
'use strict';
angular.module('creditCardApp').factory('authInterceptor',['$window','$q',function($window,$q){
return{request:function(config){
var token=$window.localStorage.getItem('authToken');
if(token){config.headers.Authorization='Bearer '+token;}
return config;},responseError:function(rejection){
if(rejection.status===401){$window.location.href='#/login';}
return $q.reject(rejection);}};
}]);
})();