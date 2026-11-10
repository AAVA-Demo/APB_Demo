(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window','$q',function($http,$window,$q){
var self=this;
self.login=function(credentials){
var deferred=$q.defer();
$http.post('/api/auth/login',credentials).then(function(response){
if(response.data&&response.data.token){
$window.sessionStorage.setItem('authToken',response.data.token);
$window.sessionStorage.setItem('userId',response.data.userId);
deferred.resolve(response.data);
}else{deferred.reject('Invalid response');}
},function(error){deferred.reject(error);});
return deferred.promise;
};
self.logout=function(){
$window.sessionStorage.removeItem('authToken');
$window.sessionStorage.removeItem('userId');
$window.location.href='#!/login';
};
self.getToken=function(){
return $window.sessionStorage.getItem('authToken');
};
self.getUserId=function(){
return $window.sessionStorage.getItem('userId');
};
self.isAuthenticated=function(){
return!!self.getToken();
};
}]);
})();