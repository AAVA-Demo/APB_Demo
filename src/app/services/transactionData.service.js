(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('TransactionDataService', ['ApiGatewayService', function(ApiGatewayService) {
      this.getTransactionsByCategory = function(category) {
        return ApiGatewayService.get('/transactions?category=' + category)
          .catch(function(error) {
            var mockTransactions = [];
            for (var i = 0; i < 10; i++) {
              mockTransactions.push({
                transactionId: 'txn-' + i,
                cardId: 'card-1',
                amount: Math.floor(Math.random() * 500) + 20,
                category: category,
                merchantName: 'Merchant ' + i,
                transactionDate: new Date(),
                description: category + ' purchase'
              });
            }
            return mockTransactions;
          });
      };
    }]);
})();