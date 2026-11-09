(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window','$q',function($http,$window,$q){
var self=this;
self.validateSession=function(){
var deferred=$q.defer();
var token=$window.sessionStorage.getItem('authToken');
if(token){
deferred.resolve({valid:true,token:token});
}else{
deferred.reject({valid:false});
}
return deferred.promise;
};
self.getUserId=function(){
return $window.sessionStorage.getItem('userId')||'user123';
};
}]);
})();