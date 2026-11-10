(function() {
  'use strict';
  angular.module('dashboardModule').service('CardService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    this.getUserCards = function(userId) {
      return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS + '/' + userId, {
        timeout: API_CONFIG.TIMEOUT
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();