(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('AuthService', ['$http', '$q', '$window', 'API_CONFIG', function($http, $q, $window, API_CONFIG) {
      var service = {
        validateSession: validateSession,
        getToken: getToken,
        isAuthenticated: isAuthenticated
      };
      return service;
      function validateSession() {
        var deferred = $q.defer();
        var token = getToken();
        if (!token) {
          deferred.reject('No token found');
          return deferred.promise;
        }
        $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.auth + '/validate', {
          headers: { 'Authorization': 'Bearer ' + token }
        }).then(function(response) {
          deferred.resolve(response.data);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.promise;
      }
      function getToken() {
        return $window.sessionStorage.getItem('authToken') || 'mock-token-12345';
      }
      function isAuthenticated() {
        return !!getToken();
      }
    }]);
})();