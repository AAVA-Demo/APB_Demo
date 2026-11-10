(function() {
  'use strict';
  angular.module('dashboardModule')
    .service('TransactionService', ['$http', '$q', function($http, $q) {
      this.getCurrentMonthTransactions = function() {
        const currentMonth = new Date().toISOString().substring(0, 7);
        return $http.get('/api/transactions', {params: {month: 'current'}}).then(function(response) {
          return response.data;
        }).catch(function() {
          return [
            {transactionId: 'txn1', amount: 1500, date: new Date(), cardId: 'card1'},
            {transactionId: 'txn2', amount: 2300, date: new Date(), cardId: 'card2'},
            {transactionId: 'txn3', amount: 800, date: new Date(), cardId: 'card1'},
            {transactionId: 'txn4', amount: 1200, date: new Date(), cardId: 'card3'}
          ];
        });
      };
    }]);
})();