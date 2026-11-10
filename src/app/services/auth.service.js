(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window','$q',function($http,$window,$q){
const self=this;
self.isAuthenticated=function(){
const token=$window.sessionStorage.getItem('authToken');
return!!token;
};
self.authenticate=function(){
const deferred=$q.defer();
const mockToken='mock-jwt-token-'+Date.now();
$window.sessionStorage.setItem('authToken',mockToken);
$window.sessionStorage.setItem('userId','user-001');
deferred.resolve({token:mockToken,userId:'user-001'});
return deferred.promise;
};
self.getToken=function(){
return $window.sessionStorage.getItem('authToken');
};
self.getUserId=function(){
return $window.sessionStorage.getItem('userId');
};
self.logout=function(){
$window.sessionStorage.removeItem('authToken');
$window.sessionStorage.removeItem('userId');
};
}]);
})();