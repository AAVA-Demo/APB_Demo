(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$window',function($window){
var self=this;
var TOKEN_KEY='cc_auth_token';
self.authenticate=function(){
var token='mock_jwt_token_'+Date.now();
$window.sessionStorage.setItem(TOKEN_KEY,token);
return token;
};
self.getToken=function(){
var token=$window.sessionStorage.getItem(TOKEN_KEY);
if(!token){
token=self.authenticate();
}
return token;
};
self.isAuthenticated=function(){
return!!$window.sessionStorage.getItem(TOKEN_KEY);
};
self.validateSession=function(){
return self.isAuthenticated();
};
self.logout=function(){
$window.sessionStorage.removeItem(TOKEN_KEY);
};
}]);
})();