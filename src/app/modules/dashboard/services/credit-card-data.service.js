(function() {
  'use strict';
  angular.module('dashboard')
    .factory('CreditCardDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        getAllCards: function() {
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.CARDS, { timeout: API_CONFIG.TIMEOUT })
            .then(function(response) {
              return response.data;
            })
            .catch(function(error) {
              return $q.reject(error);
            });
        }
      };
    }]);
})();