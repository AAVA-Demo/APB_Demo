(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('TransactionService', ['$http', '$q', 'API_BASE_URL', function($http, $q, API_BASE_URL) {
      var service = {
        fetchTransactions: fetchTransactions,
        getMonthlyTransactions: getMonthlyTransactions,
        getCardSpending: getCardSpending,
        fetchMonthlyTransactions: fetchMonthlyTransactions
      };
      return service;

      function fetchTransactions(userId, dateRange) {
        var params = { userId: userId };
        if (dateRange && dateRange.from) params.from = dateRange.from;
        if (dateRange && dateRange.to) params.to = dateRange.to;
        return $http.get(API_BASE_URL + '/api/transactions', { params: params })
          .then(function(response) { return response.data; })
          .catch(function() { return generateMockTransactions(userId); });
      }

      function getMonthlyTransactions(userId) {
        return $http.get(API_BASE_URL + '/api/transactions/current-month', { params: { userId: userId } })
          .then(function(response) { return response.data; })
          .catch(function() { return generateMockTransactions(userId).filter(function(t) { return isCurrentMonth(t.date); }); });
      }

      function getCardSpending(cardId) {
        return $http.get(API_BASE_URL + '/api/transactions/card/' + cardId)
          .then(function(response) { return response.data; })
          .catch(function() { return generateMockTransactions('U001').filter(function(t) { return t.cardId === cardId; }); });
      }

      function fetchMonthlyTransactions(userId) {
        return getMonthlyTransactions(userId);
      }

      function isCurrentMonth(date) {
        var d = new Date(date);
        var now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }

      function generateMockTransactions(userId) {
        var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
        var transactions = [];
        var now = new Date();
        for (var i = 0; i < 12; i++) {
          for (var j = 0; j < 20; j++) {
            var date = new Date(now.getFullYear(), now.getMonth() - i, Math.floor(Math.random() * 28) + 1);
            transactions.push({
              transactionId: 'T' + (i * 20 + j),
              cardId: ['C001', 'C002', 'C003'][Math.floor(Math.random() * 3)],
              amount: Math.floor(Math.random() * 5000) + 100,
              category: categories[Math.floor(Math.random() * categories.length)],
              date: date,
              transactionDate: date,
              merchantName: 'Merchant ' + j,
              description: 'Purchase at Merchant ' + j
            });
          }
        }
        return transactions;
      }
    }]);
})();