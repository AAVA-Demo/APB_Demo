(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('CardTransactionService', ['$http', '$q', function($http, $q) {
      const mockSpending = {
        card1: {monthlySpend: 5800, totalTransactions: 23, lastTransactionDate: new Date()},
        card2: {monthlySpend: 3200, totalTransactions: 15, lastTransactionDate: new Date()},
        card3: {monthlySpend: 1800, totalTransactions: 8, lastTransactionDate: new Date()},
        card4: {monthlySpend: 0, totalTransactions: 0, lastTransactionDate: null}
      };
      this.getCardSpending = function(cardId) {
        return $http.get('/api/cards/' + cardId + '/transactions').then(function(response) {
          return response.data;
        }).catch(function() {
          return mockSpending[cardId] || {monthlySpend: 0, totalTransactions: 0, lastTransactionDate: null};
        });
      };
    }]);
})();