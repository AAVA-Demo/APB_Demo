(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$window','$http','$q',function($window,$http,$q){
var vm=this;
vm.token=null;
vm.userId='user123';
vm.isAuthenticated=function(){
return vm.token!==null;
};
vm.autoLogin=function(){
vm.token='mock-jwt-token-'+Date.now();
$window.sessionStorage.setItem('authToken',vm.token);
$window.sessionStorage.setItem('userId',vm.userId);
return $q.resolve({token:vm.token,userId:vm.userId});
};
vm.validateSession=function(){
var token=$window.sessionStorage.getItem('authToken');
if(token){
vm.token=token;
vm.userId=$window.sessionStorage.getItem('userId');
return $q.resolve(true);
}
return $q.reject('Session invalid');
};
vm.getToken=function(){
return vm.token||$window.sessionStorage.getItem('authToken');
};
vm.getUserId=function(){
return vm.userId||$window.sessionStorage.getItem('userId');
};
}]);
})();