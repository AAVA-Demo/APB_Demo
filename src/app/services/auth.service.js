(function(){
'use strict';
angular.module('creditCardApp')
.service('AuthService',['$window','$q',function($window,$q){
var self=this;
var AUTH_TOKEN_KEY='cc_auth_token';
var USER_KEY='cc_user';
self.authenticate=function(){
var deferred=$q.defer();
var mockToken='mock_token_'+Date.now();
var mockUser={userId:'user123',name:'John Doe',email:'john@example.com'};
$window.sessionStorage.setItem(AUTH_TOKEN_KEY,mockToken);
$window.sessionStorage.setItem(USER_KEY,JSON.stringify(mockUser));
deferred.resolve({token:mockToken,user:mockUser});
return deferred.promise;
};
self.isAuthenticated=function(){
var token=$window.sessionStorage.getItem(AUTH_TOKEN_KEY);
return!!token;
};
self.getToken=function(){
return $window.sessionStorage.getItem(AUTH_TOKEN_KEY);
};
self.getUser=function(){
var userJson=$window.sessionStorage.getItem(USER_KEY);
return userJson?JSON.parse(userJson):null;
};
self.logout=function(){
$window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
$window.sessionStorage.removeItem(USER_KEY);
};
if(!self.isAuthenticated()){
self.authenticate();
}
}]);
})();