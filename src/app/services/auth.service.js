(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window','$q','API_CONFIG',function($http,$window,$q,API_CONFIG){
var self=this;
this.isAuthenticated=function(){
return!!$window.sessionStorage.getItem('authToken');
};
this.getUserContext=function(){
var userId=$window.sessionStorage.getItem('userId');
var token=$window.sessionStorage.getItem('authToken');
return{userId:userId,token:token};
};
this.login=function(credentials){
var deferred=$q.defer();
$http.post(API_CONFIG.baseUrl+'/auth/login',credentials,{timeout:API_CONFIG.timeout}).then(function(response){
$window.sessionStorage.setItem('authToken',response.data.token);
$window.sessionStorage.setItem('userId',response.data.userId);
deferred.resolve(response.data);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.logout=function(){
$window.sessionStorage.removeItem('authToken');
$window.sessionStorage.removeItem('userId');
};
this.mockLogin=function(){
$window.sessionStorage.setItem('authToken','mock-token-12345');
$window.sessionStorage.setItem('userId','user-001');
};
}]);
})();