(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',AuthService);
AuthService.$inject=['$http','$window'];
function AuthService($http,$window){
var vm=this;
vm.validateSession=validateSession;
vm.getToken=getToken;
function validateSession(){
var token=$window.sessionStorage.getItem('authToken');
if(!token)return false;
return true;
}
function getToken(){
return $window.sessionStorage.getItem('authToken')||'mock-token-12345';
}
}
})();