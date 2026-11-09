(function(){
'use strict';
angular.module('creditCardApp').factory('AuthInterceptor',['$q','$window',function($q,$window){
return{request:function(config){
var token=$window.localStorage.getItem('authToken');
if(token){
config.headers=config.headers||{};
config.headers.Authorization='Bearer '+token;
}
return config;
},responseError:function(rejection){
if(rejection.status===401){
$window.localStorage.removeItem('authToken');
}
return $q.reject(rejection);
}};
}]);
})();