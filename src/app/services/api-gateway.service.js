(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('ApiGatewayService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
      var baseUrl = '/api';
      this.get = function(endpoint) {
        var deferred = $q.defer();
        $http({
          method: 'GET',
          url: baseUrl + endpoint,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          console.error('API Error:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
      this.post = function(endpoint, data) {
        var deferred = $q.defer();
        $http({
          method: 'POST',
          url: baseUrl + endpoint,
          data: data,
          headers: {'Authorization': 'Bearer ' + AuthService.getToken()}
        }).then(function(response) {
          deferred.resolve(response.data);
        }).catch(function(error) {
          console.error('API Error:', error);
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }]);
})();