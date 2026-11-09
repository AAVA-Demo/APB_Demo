(function(){
'use strict';
angular.module('creditCardApp').factory('ApiFactory',['$http','$q','AuthService',function($http,$q,AuthService){
const baseUrl='/api';
function handleError(response){
const error={status:response.status,message:response.data&&response.data.message||'An error occurred',data:response.data};
return $q.reject(error);
}
function get(endpoint,config){
const headers=AuthService.getAuthHeaders();
const requestConfig=angular.extend({},{headers:headers},config);
return $http.get(baseUrl+endpoint,requestConfig).then(function(response){
return response.data;
},handleError);
}
function post(endpoint,data,config){
const headers=AuthService.getAuthHeaders();
const requestConfig=angular.extend({},{headers:headers},config);
return $http.post(baseUrl+endpoint,data,requestConfig).then(function(response){
return response.data;
},handleError);
}
return{get:get,post:post};
}]);
})();