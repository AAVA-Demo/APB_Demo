(function(){
'use strict';
angular.module('creditCardApp').factory('HttpInterceptorService',['$q','$injector',function($q,$injector){
let requestCount=0;
return{request:function(config){
requestCount++;
const token=localStorage.getItem('authToken');
if(token)config.headers.Authorization='Bearer '+token;
return config;
},response:function(response){
requestCount--;
return response;
},responseError:function(rejection){
requestCount--;
if(rejection.status===401){
window.location.href='#!/login';
}
return $q.reject(rejection);
}};
}]);
})();