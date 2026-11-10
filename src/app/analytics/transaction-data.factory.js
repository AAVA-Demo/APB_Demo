(function() {
  'use strict';
  angular.module('analyticsModule').factory('TransactionDataFactory', TransactionDataFactory);
  TransactionDataFactory.$inject = ['$http', 'API_ENDPOINTS'];
  function TransactionDataFactory($http, API_ENDPOINTS) {
    return {
      fetchTransactions: fetchTransactions
    };
    function fetchTransactions() {
      return $http.get(API_ENDPOINTS.transactions).then(function(response) {
        return response.data;
      }).catch(function() {
        return generateMockTransactions();
      });
    }
    function generateMockTransactions() {
      var transactions = [];
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var merchants = ['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Indian Oil', 'HP Petrol', 'Big Bazaar', 'Reliance Digital', 'Apollo Pharmacy', 'BookMyShow'];
      for (var i = 0; i < 100; i++) {
        var monthOffset = Math.floor(i / 10);
        var date = new Date();
        date.setMonth(date.getMonth() - monthOffset);
        date.setDate(Math.floor(Math.random() * 28) + 1);
        transactions.push({
          transactionId: 'TXN' + (1000 + i),
          cardId: (i % 3 === 0) ? '1' : '2',
          cardName: (i % 3 === 0) ? 'Visa Platinum' : 'Mastercard Gold',
          date: date,
          amount: Math.floor(Math.random() * 5000) + 100,
          merchant: merchants[i % merchants.length],
          category: categories[i % categories.length],
          description: 'Transaction ' + i,
          status: 'posted'
        });
      }
      return transactions;
    }
  }
})();