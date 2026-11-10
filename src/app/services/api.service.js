(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('ApiService', ['$http', '$q', function($http, $q) {
      var baseUrl = '/api';
      this.get = function(endpoint, params) {
        return $http({
          method: 'GET',
          url: baseUrl + endpoint,
          params: params || {}
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('API Error:', error);
          return $q.reject(error);
        });
      };
      this.post = function(endpoint, data) {
        return $http({
          method: 'POST',
          url: baseUrl + endpoint,
          data: data
        }).then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('API Error:', error);
          return $q.reject(error);
        });
      };
    }]);
  ApiService.$inject = ['$http', '$q'];
})();