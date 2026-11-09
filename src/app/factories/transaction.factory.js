(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionFactory', ['$http', '$q', 'API_ENDPOINTS', TransactionFactory]);
  function TransactionFactory($http, $q, API_ENDPOINTS) {
    return {
      getCardTransactions: function(cardId) {
        return $http.get(API_ENDPOINTS.CARD_TRANSACTIONS.replace(':cardId', cardId))
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return $q.reject(error);
          });
      }
    };
  }
})();