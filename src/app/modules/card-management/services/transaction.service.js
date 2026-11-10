(function() {
  'use strict';
  angular.module('cardManagement')
    .factory('TransactionService', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
      return {
        getTransactions: function(cardId) {
          return $http.get(API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.TRANSACTIONS, {
            params: { cardId: cardId },
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