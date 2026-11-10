(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window','$q',function($http,$window,$q){
var vm=this;
var tokenKey='authToken';
vm.validateSession=function(){
var deferred=$q.defer();
var token=$window.localStorage.getItem(tokenKey);
if(!token){
deferred.reject('No token');
return deferred.promise;
}
$http.get('/api/auth/validate').then(function(response){
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
vm.getToken=function(){
return $window.localStorage.getItem(tokenKey);
};
vm.setToken=function(token){
$window.localStorage.setItem(tokenKey,token);
};
vm.clearToken=function(){
$window.localStorage.removeItem(tokenKey);
};
}]);
})();