(function() {
  'use strict';
  angular.module('creditCardApp.analytics')
    .factory('TransactionFactory', [function() {
      function create(data) {
        return {
          transactionId: data.transactionId,
          cardId: data.cardId,
          merchantName: data.merchantName,
          merchantCategory: data.merchantCategory,
          amount: data.amount,
          currency: data.currency,
          transactionDate: data.transactionDate,
          category: data.category || '',
          description: data.description
        };
      }
      return {
        create: create
      };
    }]);
})();