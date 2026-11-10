(function() {
  'use strict';
  angular.module('creditCardManagementModule').service('TransactionService', ['$http', '$q', function($http, $q) {
    var self = this;
    self.getCardSpending = function(cardId) {
      return $http.get('/api/transactions/card/' + cardId + '/summary').then(function(response) {
        return response.data;
      }).catch(function(err) {
        return $q.reject(err);
      });
    };
    self.getCardTransactions = function(cardId) {
      return $http.get('/api/transactions/card/' + cardId).then(function(response) {
        return response.data;
      }).catch(function(err) {
        return $q.reject(err);
      });
    };
  }]);
})();