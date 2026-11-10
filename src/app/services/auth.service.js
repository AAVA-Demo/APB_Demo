(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',[function(){
var self=this;
self.getToken=function(){
return sessionStorage.getItem('authToken')||'mock-jwt-token-12345';
};
self.setToken=function(token){
sessionStorage.setItem('authToken',token);
};
self.clearToken=function(){
sessionStorage.removeItem('authToken');
};
}]);
})();