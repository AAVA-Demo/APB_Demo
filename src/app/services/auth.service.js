(function(){
'use strict';
angular.module('creditCardApp').service('AuthService',['$http','$window','API_ENDPOINTS',function($http,$window,API_ENDPOINTS){var self=this;self.isAuthenticated=function(){return!!$window.sessionStorage.getItem('authToken');};self.login=function(credentials){return $http.post(API_ENDPOINTS.baseUrl+'/auth/login',credentials).then(function(response){$window.sessionStorage.setItem('authToken',response.data.token);return response.data;});};self.logout=function(){$window.sessionStorage.removeItem('authToken');};}]);
})();