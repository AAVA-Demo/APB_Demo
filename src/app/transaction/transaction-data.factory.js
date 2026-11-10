(function() {
  'use strict';
  angular.module('transactionModule').factory('TransactionDataFactory', TransactionDataFactory);
  TransactionDataFactory.$inject = ['$http', 'API_ENDPOINTS'];
  function TransactionDataFactory($http, API_ENDPOINTS) {
    return {
      fetchTransactions: fetchTransactions,
      fetchTransactionById: fetchTransactionById
    };
    function fetchTransactions(pageNumber, pageSize) {
      return $http.get(API_ENDPOINTS.transactions, {
        params: { page: pageNumber, size: pageSize }
      }).then(function(response) {
        return response.data;
      }).catch(function() {
        return {
          transactions: generateMockTransactions(pageNumber, pageSize),
          totalCount: 100,
          pageNumber: pageNumber,
          pageSize: pageSize
        };
      });
    }
    function fetchTransactionById(transactionId) {
      return $http.get(API_ENDPOINTS.transactions + '/' + transactionId).then(function(response) {
        return response.data;
      }).catch(function() {
        return {
          transactionId: transactionId,
          cardId: '1',
          cardName: 'Visa Platinum',
          date: new Date(),
          amount: 1250,
          merchant: 'Amazon India',
          category: 'Shopping',
          description: 'Online purchase',
          status: 'posted'
        };
      });
    }
    function generateMockTransactions(page, size) {
      var transactions = [];
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var merchants = ['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Indian Oil', 'HP Petrol', 'Big Bazaar', 'Reliance Digital'];
      for (var i = 0; i < size; i++) {
        var index = (page - 1) * size + i;
        transactions.push({
          transactionId: 'TXN' + (1000 + index),
          cardId: (index % 2 === 0) ? '1' : '2',
          date: new Date(Date.now() - index * 86400000),
          amount: Math.floor(Math.random() * 5000) + 100,
          merchant: merchants[index % merchants.length],
          category: categories[index % categories.length],
          description: 'Transaction ' + index,
          status: (index % 10 === 0) ? 'pending' : 'posted'
        });
      }
      return transactions;
    }
  }
})();