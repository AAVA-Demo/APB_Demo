(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('ApiGatewayService', ['$http', '$q', '$window', function($http, $q, $window) {
      var baseUrl = '/api';
      this.get = function(endpoint) {
        var deferred = $q.defer();
        var token = $window.localStorage.getItem('authToken');
        var config = {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };
        $http.get(baseUrl + endpoint, config)
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('API Error:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
      this.post = function(endpoint, data) {
        var deferred = $q.defer();
        var token = $window.localStorage.getItem('authToken');
        var config = {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };
        $http.post(baseUrl + endpoint, data, config)
          .then(function(response) {
            deferred.resolve(response.data);
          })
          .catch(function(error) {
            console.error('API Error:', error);
            deferred.reject(error);
          });
        return deferred.promise;
      };
    }]);
})();