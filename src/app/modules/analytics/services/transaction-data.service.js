(function() {
  'use strict';
  angular.module('analytics')
    .factory('TransactionDataService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        getTransactions: function(params) {
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS, {
            params: params,
            timeout: API_CONFIG.TIMEOUT
          })
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