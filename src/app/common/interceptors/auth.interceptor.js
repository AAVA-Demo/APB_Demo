(function(){
'use strict';
angular.module('creditCardApp').factory('AuthInterceptor',AuthInterceptor);
AuthInterceptor.$inject=['$window','$q'];
function AuthInterceptor($window,$q){
return{request:function(config){
var token=$window.localStorage.getItem('authToken')||'mock-jwt-token';
if(token){
config.headers.Authorization='Bearer '+token;
}
return config;
},responseError:function(rejection){
if(rejection.status===401||rejection.status===403){
$window.location.href='#!/login';
}
return $q.reject(rejection);
}};
}
})();