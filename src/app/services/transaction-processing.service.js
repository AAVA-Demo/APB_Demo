(function() {
  'use strict';
  angular.module('app.cardManagement')
    .service('TransactionProcessingService', ['$http', '$q', 'API_CONFIG', TransactionProcessingService]);
  function TransactionProcessingService($http, $q, API_CONFIG) {
    var self = this;
    self.getCardTransactions = getCardTransactions;
    function getCardTransactions(cardId) {
      return $http.get(API_CONFIG.baseUrl + API_CONFIG.endpoints.transactions, {
        params: {cardId: cardId}
      })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        return $q.reject(error);
      });
    }
  }
})();