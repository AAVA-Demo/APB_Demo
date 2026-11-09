(function(){
'use strict';
angular.module('creditCardApp').factory('authInterceptor',['$q','$window',function($q,$window){
return{
request:function(config){
var token=$window.sessionStorage.getItem('authToken');
if(token){
config.headers=config.headers||{};
config.headers.Authorization='Bearer '+token;
}
return config;
},
responseError:function(rejection){
if(rejection.status===401){
$window.location.href='/login';
}
return $q.reject(rejection);
}
};
}]);
})();