(function() {
  'use strict';
  angular.module('creditCardApp').service('transactionService', ['$http', '$q', function($http, $q) {
    var self = this;
    self.getMonthlySpend = function() {
      return $http.get('/api/transactions/monthly').then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getTransactionsByCard = function(cardId) {
      return $http.get('/api/transactions/card/' + cardId).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
  }]);
})();