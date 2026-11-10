(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('ApiGatewayService', ['$http', '$q', function($http, $q) {
      var baseUrl = 'https://api.creditcard.demo';
      return {
        get: function(endpoint) {
          return $http.get(baseUrl + endpoint)
            .then(function(response) { return response.data; })
            .catch(function(error) { return $q.reject(error); });
        },
        post: function(endpoint, data) {
          return $http.post(baseUrl + endpoint, data)
            .then(function(response) { return response.data; })
            .catch(function(error) { return $q.reject(error); });
        }
      };
    }]);
})();