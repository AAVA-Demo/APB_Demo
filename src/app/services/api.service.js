(function(){
'use strict';
angular.module('creditCardApp').service('ApiService',['$http','$q','AuthService',function($http,$q,AuthService){
var self=this;
self.request=function(config){
config.headers=config.headers||{};
var token=AuthService.getToken();
if(token){config.headers['Authorization']='Bearer '+token;}
return $http(config).then(function(response){return response.data;}).catch(function(error){
console.error('API Error:',error);
return $q.reject(error);});
};
self.get=function(url,params){
return self.request({method:'GET',url:url,params:params});
};
self.post=function(url,data){
return self.request({method:'POST',url:url,data:data});
};
}]);
})();